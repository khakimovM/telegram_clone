import MessageCard from "@/components/cards/MessageCard";
import ChatLoading from "@/components/loadings/ChatLoading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/lib/validation";
import { Paperclip, Send, Smile, X } from "lucide-react";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import emojies from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { useLoading } from "@/hooks/use-loading";
import { IMessage } from "@/types";
import { useCurrentContact } from "@/hooks/use-current";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { useSession } from "next-auth/react";

interface Props {
  onSubmitMessage: (values: z.infer<typeof messageSchema>) => Promise<void>;
  onReadMessages: () => Promise<void>;
  onReaction: (reaction: string, messageId: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onTyping: (e: ChangeEvent<HTMLInputElement>) => void;
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
  messages: IMessage[];
}

const Chat: FC<Props> = ({
  onSubmitMessage,
  messageForm,
  messages,
  onReadMessages,
  onReaction,
  onDeleteMessage,
  onTyping,
}) => {
  const { loadMessage } = useLoading();
  const { editedMessage, setEditedMesssage, currentContact } =
    useCurrentContact();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const { resolvedTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const lastMsgIdRef = useRef<string | null>(null);

  const filtredMessages = messages.filter(
    (message, index, self) =>
      ((message.sender._id === session?.currentUser._id &&
        message.receiver._id === currentContact?._id) ||
        (message.sender._id === currentContact?._id &&
          message.receiver._id === session?.currentUser._id)) &&
      index === self.findIndex((m) => m._id === message._id),
  );

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const text = messageForm.getValues("text") || "";
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    messageForm.setValue("text", newText);

    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  useEffect(() => {
    onReadMessages();

    const lastMsg = filtredMessages[filtredMessages.length - 1];

    // Reset ref when there are no messages (e.g. after contact switch to empty chat)
    if (!lastMsg) {
      lastMsgIdRef.current = null;
      return;
    }

    // Only scroll when a genuinely new message appears at the end.
    // Reactions, edits, and status changes update existing messages in-place
    // without changing _id, so they won't trigger a scroll.
    if (lastMsg._id !== lastMsgIdRef.current) {
      const isInitialLoad = lastMsgIdRef.current === null;
      messagesEndRef.current?.scrollIntoView({
        behavior: isInitialLoad ? "instant" : "smooth",
      });
      lastMsgIdRef.current = lastMsg._id;
    }
  }, [messages]);

  useEffect(() => {
    messageForm.setValue("text", editedMessage?.text as string);
  }, [editedMessage]);

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden chat-background">
      {/* Messages area — only this div scrolls, not the page */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2 sidebar-custom-scrollbar">
        {loadMessage && <ChatLoading />}

        {filtredMessages.map((message) => (
          <MessageCard
            key={message._id}
            message={message}
            onReaction={onReaction}
            onDeleteMessage={onDeleteMessage}
          />
        ))}

        {filtredMessages.length === 0 && !loadMessage && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 select-none">
              <div
                className="text-7xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => onSubmitMessage({ text: "👋" })}
              >
                👋
              </div>
              <p className="text-sm text-muted-foreground">
                Say hello to start the conversation
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Edited message indicator */}
      {editedMessage && (
        <div className="shrink-0 flex items-center justify-between px-3 py-1.5 bg-primary/10 border-t border-primary/20 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <span className="font-medium">Editing:</span>
            <span className="text-foreground truncate max-w-50">
              {editedMessage.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditedMesssage(null);
              messageForm.setValue("text", "");
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 bg-background border-t border-border px-2 py-2">
        <Form {...messageForm}>
          <form
            onSubmit={messageForm.handleSubmit(onSubmitMessage)}
            className="w-full flex items-center gap-1.5"
          >
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size={"icon"}
                  type="button"
                  variant={"ghost"}
                  className="shrink-0 text-muted-foreground hover:text-primary"
                >
                  <Paperclip size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <UploadDropzone
                  endpoint={"imageUploader"}
                  onClientUploadComplete={(res) => {
                    onSubmitMessage({ text: "", image: res[0].url });
                    setIsOpen(false);
                  }}
                  config={{ appendOnPaste: true, mode: "auto" }}
                />
              </DialogContent>
            </Dialog>

            <FormField
              control={messageForm.control}
              name="text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Write a message..."
                      value={field.value}
                      onBlur={() => field.onBlur()}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        onTyping(e);
                        if (e.target.value === "") setEditedMesssage(null);
                      }}
                      ref={inputRef}
                      className="bg-secondary rounded-full border-transparent focus-visible:ring-primary/40 px-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  type="button"
                  className="shrink-0 text-muted-foreground hover:text-primary"
                >
                  <Smile size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none rounded-xl shadow-xl absolute right-6 bottom-0">
                <Picker
                  data={emojies}
                  theme={resolvedTheme === "dark" ? "dark" : "light"}
                  onEmojiSelect={(emoji: { native: string }) =>
                    handleEmojiSelect(emoji.native)
                  }
                />
              </PopoverContent>
            </Popover>

            <Button
              size={"icon"}
              type="submit"
              className="shrink-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send size={16} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
