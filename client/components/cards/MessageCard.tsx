import { useCurrentContact } from "@/hooks/use-current";
import { CONST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck, Edit2, Trash } from "lucide-react";
import React, { FC } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import Image from "next/image";

interface Props {
  message: IMessage;
  onReaction: (reaction: string, messageId: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

const reactions = ["😂", "❤", "🔥", "👍", "👎"];

const MessageCard: FC<Props> = ({ message, onReaction, onDeleteMessage }) => {
  const { currentContact, setEditedMesssage } = useCurrentContact();

  const isReceived = message.sender._id === currentContact?._id;
  const isSent = !isReceived;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "mx-3 font-medium text-xs flex",
            isReceived ? "justify-start" : "justify-end",
            message.reaction ? "mt-1 mb-5" : "my-1",
          )}
        >
          <div
            className={cn(
              "relative p-2.5 pl-3 pr-12 max-w-[72%] shadow-sm wrap-break-word",
              isReceived
                ? "bg-primary text-white rounded-2xl rounded-tl-sm"
                : "bg-secondary text-foreground rounded-2xl rounded-tr-sm",
            )}
          >
            {message.image && (
              <div className="mb-1 rounded-lg overflow-hidden">
                <Image
                  src={message.image}
                  alt={message.image}
                  width={220}
                  height={160}
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            {message.text.length > 0 && (
              <p className="text-sm leading-relaxed">{message.text}</p>
            )}

            <div
              className={cn(
                "text-[10px] absolute bottom-1 right-2 flex items-center gap-0.5",
                isReceived ? "text-white/70" : "text-muted-foreground",
              )}
            >
              <span>{format(message.updatedAt, "HH:mm")}</span>
              {isSent && (
                <span className="ml-0.5">
                  {message.status === CONST.READ ? (
                    <CheckCheck size={12} className="text-primary" />
                  ) : (
                    <Check size={12} />
                  )}
                </span>
              )}
            </div>

            {message.reaction && (
              <span className="absolute -bottom-4 -right-1 text-sm bg-background border border-border/60 shadow-sm rounded-full px-1.5 py-0.5 leading-none select-none">
                {message.reaction}
              </span>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56 p-1.5 rounded-xl shadow-xl">
        <ContextMenuItem className="grid grid-cols-5 rounded-lg p-1 focus:bg-transparent">
          {reactions.map((reaction) => (
            <div
              key={reaction}
              className={cn(
                "text-xl cursor-pointer p-1.5 hover:bg-primary/20 transition-all flex items-center justify-center rounded-lg",
                message.reaction === reaction && "bg-primary/20",
              )}
              onClick={() => onReaction(reaction, message._id)}
            >
              {reaction}
            </div>
          ))}
        </ContextMenuItem>

        {isSent && (
          <>
            <ContextMenuSeparator />

            {!message.image && (
              <ContextMenuItem
                className="cursor-pointer rounded-lg gap-2"
                onClick={() => setEditedMesssage(message)}
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </ContextMenuItem>
            )}

            <ContextMenuItem
              className="cursor-pointer rounded-lg gap-2 text-destructive focus:text-destructive"
              onClick={() => onDeleteMessage(message._id)}
            >
              <Trash size={14} />
              <span>Delete</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageCard;
