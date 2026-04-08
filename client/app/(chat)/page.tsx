"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ContactList from "./_components/ContactList";
import { useRouter } from "next/navigation";
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
import { IError, IUser } from "@/types";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";

const Homepage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const { setCreating, setLoading, isLoading } = useLoading();
  const { currentContact, setCurrentContact } = useCurrentContact();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();

  const router = useRouter();
  const socket = useRef<ReturnType<typeof io> | null>(null);

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      text: "",
      image: "",
    },
  });

  const getContacts = async () => {
    setLoading(true);
    const token = await generateToken(session?.currentUser._id);
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[] }>(
        "api/user/contacts",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setContacts(data.contacts);
    } catch (error) {
      toast.error("can not fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const onSendMessage = (value: z.infer<typeof messageSchema>) => {
    // API call to message
    console.log(value);
  };

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
      toast.success("contact added succesfully");
      contactForm.reset();
    } catch (error: any) {
      if ((error as IError).response?.data?.message) {
        return toast.error((error as IError).response?.data?.message);
      }
      return toast.error("Something went wrong ");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    router.replace("/");
    socket.current = io(`ws://localhost:5000`);
    console.log("Socket connected");
  }, []);

  useEffect(() => {
    if (session?.currentUser._id) {
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

  return (
    <>
      {/* Sidebar */}
      <div className="w-80 h-screen border-r inset-0 fixed z-50">
        {/* Loading */}
        {isLoading && (
          <div className="w-full h-[95vh] flex justify-center items-center">
            <Loader2 size={50} className="animate-spin" />
          </div>
        )}

        {/* Contact List */}
        {!isLoading && <ContactList contacts={contacts} />}
      </div>

      {/* Chat area*/}
      <div className="pl-80 w-full">
        {/* Add contact */}

        {!currentContact?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {/* Chat */}

        {currentContact?._id && (
          <div className="w-full relative">
            {/* Top chat */}
            <TopChat />
            {/* Chat message */}
            <Chat messageForm={messageForm} onSendMessage={onSendMessage} />
          </div>
        )}
      </div>
    </>
  );
};

export default Homepage;
