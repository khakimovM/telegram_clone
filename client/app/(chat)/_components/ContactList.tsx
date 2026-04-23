"use client";

import { IUser } from "@/types";
import { FC, useState } from "react";
import Settings from "./Settings";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, sliceText } from "@/lib/utils";
import { useCurrentContact } from "@/hooks/use-current";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { CONST } from "@/lib/constants";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";

interface Props {
  contacts: IUser[];
}

const ContactList: FC<Props> = ({ contacts }) => {
  const [query, setQuery] = useState("");
  const { currentContact, setCurrentContact } = useCurrentContact();
  const { onlineUsers } = useAuth();
  const { data: session } = useSession();

  const filteredContacts = contacts
    .filter((contact) =>
      contact.email.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = a.lastMessage?.updatedAt
        ? new Date(a.lastMessage.updatedAt).getTime()
        : 0;
      const dateB = b.lastMessage?.updatedAt
        ? new Date(b.lastMessage.updatedAt).getTime()
        : 0;
      return dateB - dateA;
    });

  const renderContact = (contact: IUser) => {
    const onChat = () => {
      if (currentContact?._id === contact._id) return;
      setCurrentContact(contact);
    };

    const isOnline = onlineUsers.some((user) => user._id === contact._id);
    const isSelected = currentContact?._id === contact._id;

    const isUnread =
      contact.lastMessage &&
      contact.lastMessage.sender._id !== session?.currentUser._id &&
      contact.lastMessage.status !== CONST.READ;

    return (
      <div
        className={cn(
          "flex justify-between items-center cursor-pointer px-3 py-2.5 transition-colors hover:bg-secondary/60",
          isSelected && "bg-secondary/80",
        )}
        onClick={onChat}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with online indicator */}
          <div className="relative shrink-0">
            <Avatar className="w-11 h-11">
              <AvatarImage
                src={contact.avatar}
                alt={contact.email}
                className="object-cover"
              />
              <AvatarFallback className="uppercase text-sm font-semibold bg-primary/20 text-primary">
                {contact.email[0]}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-10" />
            )}
          </div>

          {/* Name and last message */}
          <div className="min-w-0 flex-1">
            <h2
              className={cn(
                "capitalize text-sm font-medium truncate",
                isUnread && "font-semibold",
              )}
            >
              {contact.email.split("@")[0]}
            </h2>

            {contact.lastMessage?.image ? (
              <div className="flex items-center gap-1">
                <Image
                  src={contact.lastMessage.image}
                  alt="photo"
                  width={16}
                  height={16}
                  className="object-cover rounded"
                />
                <p
                  className={cn(
                    "text-xs truncate",
                    isUnread
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  Photo
                </p>
              </div>
            ) : (
              <p
                className={cn(
                  "text-xs truncate",
                  isUnread
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {contact.lastMessage
                  ? sliceText(contact.lastMessage.text, 28)
                  : "No messages yet"}
              </p>
            )}
          </div>
        </div>

        {/* Right side: time + unread dot */}
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          {contact.lastMessage && (
            <p
              className={cn(
                "text-[11px]",
                isUnread ? "text-primary font-medium" : "text-muted-foreground",
              )}
            >
              {format(contact.lastMessage.updatedAt, "HH:mm")}
            </p>
          )}
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-primary block" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-1 px-2 py-2 sticky top-0 bg-background z-50 border-b border-border">
        <Settings />
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-secondary rounded-full pl-8 border-transparent focus-visible:ring-primary/40 text-sm h-9"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1">
        {filteredContacts.length === 0 ? (
          <div className="w-full h-[85vh] flex flex-col justify-center items-center gap-3 text-muted-foreground">
            <Search size={40} className="opacity-30" />
            <p className="text-sm">
              {query ? "No contacts found" : "Contact list is empty"}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact._id}>{renderContact(contact)}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;
