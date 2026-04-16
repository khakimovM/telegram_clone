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

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "m-2.5 font-medium text-xs flex",
            message.sender._id === currentContact?._id
              ? "justify-start"
              : "justify-end",
          )}
        >
          <div
            className={cn(
              "relative inline p-2 pl-2.5 pr-12 max-w-full",
              message.sender._id === currentContact?._id
                ? "bg-primary"
                : "bg-secondary",
            )}
          >
            {message.image && (
              <Image
                src={message.image}
                alt={message.image}
                width={200}
                height={150}
              />
            )}
            {message.text.length > 0 && (
              <p className="text-sm text-white">{message.text}</p>
            )}

            <div className="text-[9px] p-px absolute bottom-0 right-1 opacity-60 flex gap-0.75">
              <p> {format(message.updatedAt, "hh:mm")}</p>
              <div className="self-end">
                {message.receiver._id === currentContact?._id &&
                  (message.status === CONST.READ ? (
                    <CheckCheck size={12} />
                  ) : (
                    <Check size={12} />
                  ))}
              </div>
            </div>

            <span className="absolute -right-2 -bottom-2">
              {message.reaction}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 p-1 mb-10">
        <ContextMenuItem className="grid grid-cols-5">
          {reactions.map((reaction) => (
            <div
              key={reaction}
              className={cn(
                "text-xl cursor-pointer p-1 hover:bg-primary/50 transition-all flex items-center justify-center",
                message.reaction === reaction && "bg-primary/50",
              )}
              onClick={() => onReaction(reaction, message._id)}
            >
              {reaction}
            </div>
          ))}
        </ContextMenuItem>
        {message.sender._id !== currentContact?._id && (
          <>
            <ContextMenuSeparator />

            {!message.image && (
              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => setEditedMesssage(message)}
              >
                <Edit2 size={14} className="mr-2" />
                <span>Edit</span>
              </ContextMenuItem>
            )}

            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => onDeleteMessage(message._id)}
            >
              <Trash size={14} className="mr-2" />
              <span>Delete</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageCard;
