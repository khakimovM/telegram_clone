"use client";

import { Loader2 } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ContactList from "./_components/ContactList";
import AddContact from "./_components/AddContact";
import { useCurrentContact } from "@/hooks/use-current";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import TopChat from "./_components/TopChat";
import Chat from "./_components/Chat";
import { useLoading } from "@/hooks/use-loading";
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/generate-token";
import { axiosClient } from "@/http/axios";
import { IError, IMessage, IUser } from "@/types";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";
import useAudio from "@/hooks/use-audio";
import { CONST } from "@/lib/constants";

const Homepage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { setCreating, setLoading, isLoading, setLoadMessage, setTyping } =
    useLoading();
  const { currentContact, editedMessage, setEditedMesssage } =
    useCurrentContact();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();
  const { playSound } = useAudio();

  const socket = useRef<ReturnType<typeof io> | null>(null);

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", image: "" },
  });

  // Kontaktlarni olish
  const getContacts = async () => {
    setLoading(true);
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[] }>(
        "/api/user/contacts",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setContacts(data.contacts);
    } catch {
      toast.error("Can not fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Xabarlarni olish
  const getMessages = async () => {
    if (!currentContact?._id) return;
    setLoadMessage(true);
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.get<{ messages: IMessage[] }>(
        `/api/user/messages/${currentContact._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages(data.messages);

      // Xabarlar ochilganda oxirgi xabarni o'qilgan deb belgilash
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact._id
            ? {
                ...item,
                lastMessage: item.lastMessage
                  ? { ...item.lastMessage, status: CONST.READ }
                  : null,
              }
            : item,
        ),
      );
    } catch {
      toast.error("Cannot fetch messages");
    } finally {
      setLoadMessage(false);
    }
  };

  // Xabar yuborish
  const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true);
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.post<IGetSocketType>(
        "/api/user/message",
        { ...values, receiver: currentContact?._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages((prev) => [...prev, data.newMessage]);
      messageForm.reset();

      // Socket orqali yuborish
      socket.current?.emit("sendMessage", {
        newMessage: data.newMessage,
        receiver: data.receiver,
        sender: data.sender,
      });

      if (!data.sender.muted) {
        playSound(data.sender.sendingSound);
      }

      // Kontaktlar ro'yxatida oxirgi xabarni yangilash
      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage: { ...data.newMessage, status: CONST.READ },
              }
            : item,
        ),
      );
    } catch {
      toast.error("Cannot send message");
    } finally {
      setCreating(false);
    }
  };

  // MEssageni Submit qilish
  const onSubmitMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true);
    if (editedMessage?._id) {
      onEditMessage(editedMessage._id, values.text);
    } else {
      onSendMessage(values);
    }
  };

  // Xabarlarni o'qilgan deb belgilash
  const onReadMessages = async () => {
    const receivedMessages = messages.filter(
      (m) =>
        m.receiver._id === session?.currentUser?._id && m.status !== CONST.READ,
    );

    if (receivedMessages.length === 0) return;

    try {
      const token = await generateToken(session?.currentUser._id);
      const { data } = await axiosClient.post<{ messages: IMessage[] }>(
        "/api/user/message-read",
        { messages: receivedMessages },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Socket serveringizga to'g'ri tartibda yuborish: (receiver, messages)
      socket.current?.emit("readMessages", {
        messages: receivedMessages,
        receiver: currentContact,
      });

      setMessages((prev) =>
        prev.map((item) => {
          const isRead = data.messages.find((msg) => msg._id === item._id);
          return isRead ? { ...item, status: CONST.READ } : item;
        }),
      );
    } catch {
      toast.error("Cannot read messages");
    }
  };

  // Kontakt qo'shish
  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setCreating(true);
    try {
      const token = await generateToken(session?.currentUser._id);
      const { data } = await axiosClient.post<{ contact: IUser }>(
        "/api/user/contact",
        values,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setContacts((prev) => [...prev, data.contact]);
      socket.current?.emit("createContact", {
        currentUser: session?.currentUser,
        receiver: data.contact,
      });
      toast.success("Contact added successfully");
      contactForm.reset();
    } catch (error: any) {
      const msg =
        (error as IError).response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  // Reaksiya yaratish
  const onReaction = async (reaction: string, messageId: string) => {
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.post<{ updatedMessage: IMessage }>(
        "/api/user/reaction",
        { reaction, messageId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages((prev) =>
        prev.map((item) =>
          item._id === data.updatedMessage._id
            ? { ...item, reaction: data.updatedMessage.reaction }
            : item,
        ),
      );

      socket.current?.emit("updateMessage", {
        updatedMessage: data.updatedMessage,
        receiver: currentContact,
        sender: session?.currentUser,
      });
    } catch (error) {
      toast.error("cannot react to message");
    }
  };

  // Message o'chirish
  const onDeleteMessage = async (messageId: string) => {
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.delete<{ deletedMessage: IMessage }>(
        `/api/user/message/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const filteredMessages = messages.filter(
        (item) => item._id !== data.deletedMessage._id,
      );
      const lastMessage = filteredMessages.length
        ? filteredMessages[filteredMessages.length - 1]
        : null;
      setMessages(filteredMessages);

      socket.current?.emit("deleteMessage", {
        deletedMessage: data.deletedMessage,
        sender: session?.currentUser,
        receiver: currentContact,
        filteredMessages,
      });

      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage:
                  item.lastMessage?._id === messageId
                    ? lastMessage
                    : item.lastMessage,
              }
            : item,
        ),
      );
    } catch (error) {
      toast.error("Cannot delete message");
    }
  };

  // Messageni edit qilish
  const onEditMessage = async (messageId: string, text: string) => {
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.put<{ updatedMessage: IMessage }>(
        `/api/user/message/${messageId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages((prev) =>
        prev.map((item) =>
          item._id === data.updatedMessage._id
            ? { ...item, text: data.updatedMessage.text }
            : item,
        ),
      );

      socket.current?.emit("updateMessage", {
        updatedMessage: data.updatedMessage,
        receiver: currentContact,
        sender: session?.currentUser,
      });

      messageForm.reset();

      setContacts((prev) =>
        prev.map((item) =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage:
                  item.lastMessage?._id === messageId
                    ? data.updatedMessage
                    : item.lastMessage,
              }
            : item,
        ),
      );
      setEditedMesssage(null);
    } catch (error) {
      toast.error("Cannot edit message");
    }
  };

  // Real time typing
  const onTyping = (e: ChangeEvent<HTMLInputElement>) => {
    socket.current?.emit("typing", {
      receiver: currentContact,
      sender: session?.currentUser,
      message: e.target.value,
    });
  };

  // Socket ulanish
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    return () => {
      socket.current?.disconnect();
    }; // Cleanup
  }, []);

  // Onlayn foydalanuvchilar
  useEffect(() => {
    if (session?.currentUser?._id) {
      socket.current?.emit("addOnlineUsers", session.currentUser);
      socket.current?.on(
        "getOnlineUsers",
        (data: { socketId: string; user: IUser }[]) => {
          setOnlineUsers(data.map((item) => item.user));
        },
      );
      getContacts();
    }
  }, [session?.currentUser]);

  // Socket tinglovchilari (Events)
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("getCreateUser", (user) => {
      setContacts((prev) => {
        if (prev.some((c) => c._id === user._id)) return prev;
        return [...prev, user];
      });
    });

    socket.current.on(
      "getNewMessage",
      ({ newMessage, sender, receiver }: IGetSocketType) => {
        setTyping({ message: "", sender: null });
        if (currentContact?._id === newMessage.sender._id) {
          setMessages((prev) => [...prev, newMessage]);
        }

        setContacts((prev) =>
          prev.map((contact) => {
            if (contact._id === sender._id) {
              return {
                ...contact,
                lastMessage: {
                  ...newMessage,
                  status:
                    currentContact?._id === sender._id
                      ? CONST.READ
                      : newMessage.status,
                },
              };
            }
            return contact;
          }),
        );

        toast.info(`New message from ${sender.email.split("@")[0]}`);
        if (!receiver.muted) playSound(receiver.notificationSound);
      },
    );

    socket.current.on("getReadMessages", (messages: IMessage[]) => {
      setMessages((prev) =>
        prev.map((item) => {
          const isRead = messages.find((msg) => msg._id === item._id);
          return isRead ? { ...item, status: CONST.READ } : item;
        }),
      );
    });

    socket.current.on(
      "getUpdatedMessage",
      ({ updatedMessage, sender, receiver }: IGetRectionType) => {
        setTyping({ message: "", sender: null });
        setMessages((prev) =>
          prev.map((item) =>
            item._id === updatedMessage._id
              ? {
                  ...item,
                  reaction: updatedMessage.reaction,
                  text: updatedMessage.text,
                }
              : item,
          ),
        );

        setContacts((prev) =>
          prev.map((item) =>
            item._id === sender._id
              ? {
                  ...item,
                  lastMessage:
                    item.lastMessage?._id === updatedMessage._id
                      ? updatedMessage
                      : item.lastMessage,
                }
              : item,
          ),
        );
      },
    );

    socket.current.on(
      "getDeletedMessage",
      ({
        deletedMessage,
        receiver,
        sender,
        filteredMessages,
      }: IGetDeleteMessageType) => {
        setMessages(filteredMessages);
        const lastMessage = filteredMessages.length
          ? filteredMessages[filteredMessages.length - 1]
          : null;
        setContacts((prev) =>
          prev.map((item) =>
            item._id === sender._id
              ? {
                  ...item,
                  lastMessage:
                    item.lastMessage?._id === deletedMessage._id
                      ? lastMessage
                      : item.lastMessage,
                }
              : item,
          ),
        );
      },
    );

    socket.current.on("getTyping", ({ message, sender }: IGetTyping) => {
      if (currentContact?._id === sender._id) {
        setTyping({ message, sender });
      }
    });

    return () => {
      socket.current?.off("getCreateUser");
      socket.current?.off("getNewMessage");
      socket.current?.off("getReadMessages");
    };
  }, [session?.currentUser, currentContact?._id]);

  useEffect(() => {
    getMessages();
  }, [currentContact?._id]);

  return (
    <>
      <div className="w-80 h-screen border-r inset-0 fixed z-50 bg-background sidebar-custom-scrollbar overflow-y-scroll">
        {isLoading ? (
          <div className="w-full h-[95vh] flex justify-center items-center">
            <Loader2 size={50} className="animate-spin" />
          </div>
        ) : (
          <ContactList contacts={contacts} />
        )}
      </div>

      <div className="pl-80 w-full">
        {!currentContact?._id ? (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        ) : (
          <div className="w-full relative">
            <TopChat messages={messages} />
            <Chat
              messageForm={messageForm}
              onSubmitMessage={onSubmitMessage}
              messages={messages}
              onReadMessages={onReadMessages}
              onReaction={onReaction}
              onDeleteMessage={onDeleteMessage}
              onTyping={onTyping}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Homepage;

interface IGetSocketType {
  receiver: IUser;
  sender: IUser;
  newMessage: IMessage;
  updatedMessage?: IMessage;
}

interface IGetRectionType {
  receiver: IUser;
  sender: IUser;
  updatedMessage: IMessage;
}

interface IGetDeleteMessageType {
  receiver: IUser;
  sender: IUser;
  deletedMessage: IMessage;
  filteredMessages: IMessage[];
}

interface IGetTyping {
  message: string;
  sender: IUser;
}
