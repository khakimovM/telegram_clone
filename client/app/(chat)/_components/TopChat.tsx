import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentContact } from "@/hooks/use-current";
import { useLoading } from "@/hooks/use-loading";
import { sliceText } from "@/lib/utils";
import { IMessage } from "@/types";
import { Info } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  messages: IMessage[];
}

const TopChat: FC<Props> = ({ messages }) => {
  const { currentContact } = useCurrentContact();
  const { onlineUsers } = useAuth();
  const { typing } = useLoading();

  const isOnline = onlineUsers.some((user) => user._id === currentContact?._id);

  return (
    <div className="w-full flex justify-between items-center h-15 border-b sticky top-0 z-50 px-4 bg-background shadow-sm">
      {/* Left: avatar + name + status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={currentContact?.avatar}
              alt={currentContact?.email}
              className="object-cover"
            />
            <AvatarFallback className="uppercase text-sm font-semibold bg-primary/20 text-primary">
              {currentContact?.email[0]}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-sm capitalize">
            {currentContact?.email.split("@")[0]}
          </h2>

          {typing.message.length > 0 ? (
            <div className="flex items-center gap-1">
              <p className="text-xs text-primary animate-pulse truncate max-w-40">
                {sliceText(typing.message, 22)}
              </p>
              <div className="flex items-end gap-0.5 mb-0.5">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          ) : (
            <p className="text-xs">
              {isOnline ? (
                <span className="text-green-500">online</span>
              ) : (
                <span className="text-muted-foreground">
                  last seen recently
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Right: info button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="text-muted-foreground hover:text-primary"
          >
            <Info size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80 p-0 overflow-y-scroll sidebar-custom-scrollbar">
          <SheetHeader className="sr-only">
            <SheetTitle />
          </SheetHeader>

          {/* Profile header */}
          <div className="bg-primary/10 dark:bg-primary/5 pt-8 pb-4 px-4 flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={currentContact?.avatar}
                alt={currentContact?.email}
                className="object-cover"
              />
              <AvatarFallback className="uppercase text-4xl font-semibold bg-primary/20 text-primary">
                {currentContact?.email[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="font-semibold text-lg capitalize">
                {currentContact?.email.split("@")[0]}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentContact?.email}
              </p>
            </div>
          </div>

          {/* Info section */}
          <div className="p-4 space-y-3">
            {(currentContact?.firstName || currentContact?.lastName) && (
              <div className="bg-secondary rounded-xl px-3 py-2.5 space-y-2">
                {currentContact?.firstName && (
                  <div>
                    <p className="text-xs text-muted-foreground">First name</p>
                    <p className="text-sm font-medium">
                      {currentContact.firstName}
                    </p>
                  </div>
                )}
                {currentContact?.lastName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last name</p>
                    <p className="text-sm font-medium">
                      {currentContact.lastName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentContact?.bio && (
              <div className="bg-secondary rounded-xl px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm">{currentContact.bio}</p>
              </div>
            )}
          </div>

          {/* Shared images */}
          {messages.some((msg) => msg.image) && (
            <div className="px-4 pb-4">
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                Shared Media
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {messages
                  .filter((msg) => msg.image)
                  .map((msg) => (
                    <div
                      key={msg._id}
                      className="w-full h-28 relative rounded-xl overflow-hidden"
                    >
                      <Image
                        src={msg.image}
                        alt={msg._id}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TopChat;
