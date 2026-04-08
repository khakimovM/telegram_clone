"use client";

import { IUser } from "@/types";
import { FC, useState } from "react";
import Settings from "./Settings";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentContact } from "@/hooks/use-current";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  contacts: IUser[];
}

const ContactList: FC<Props> = ({ contacts }) => {
  let [query, setQuery] = useState("");
  const router = useRouter();
  const { currentContact, setCurrentContact } = useCurrentContact();
  const { onlineUsers } = useAuth();

  const filteredContacts = contacts.filter((contact) =>
    contact.email.toLowerCase().includes(query.toLowerCase()),
  );

  console.log(onlineUsers);

  const renderContact = (contact: IUser) => {
    const onChat = () => {
      if (currentContact?._id === contact._id) return;
      console.log("chatting with: ", contact.email);
      setCurrentContact(contact);
      router.push(`/?chat=${contact._id}`);
    };

    return (
      <div
        className={cn(
          "flex justify-between items-center cursor-pointer hover:bg-secondary/50 p-2 ",
          currentContact?._id === contact._id && "bg-secondary/50",
        )}
        onClick={onChat}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={contact.avatar}
                alt={contact.email}
                className="object-cover"
              />
              <AvatarFallback className="uppercase">
                {contact.email[0]}
              </AvatarFallback>
            </Avatar>

            {onlineUsers.some((user) => user._id === contact._id) && (
              <div className="size-3 bg-green-500 absolute rounded-full  bottom-0 right-0 z-50!"></div>
            )}
          </div>

          <div>
            <h2 className="capitalize line-clamp-1 text-sm">
              {contact.email.split("@")[0]}
            </h2>
            <p className="text-xs line-clamp-1 text-muted-foreground">
              No message yet
            </p>
          </div>
        </div>

        <div className="self-end">
          <p className="text-xs text-muted-foreground">19:20 pm</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center pl-2 sticky top-0 bg-background">
        <Settings />
        <div className="m-2 w-full">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-secondary"
            type="text"
            placeholder="search..."
          />
        </div>
      </div>

      {/* Contacts */}

      {filteredContacts.length === 0 ? (
        <div className="w-full h-[95vh] flex justify-center items-center text-center text-muted-foreground">
          <p>Contact list is empty</p>
        </div>
      ) : (
        filteredContacts.map((contact) => (
          <div key={contact._id}>{renderContact(contact)}</div>
        ))
      )}
    </>
  );
};

export default ContactList;
