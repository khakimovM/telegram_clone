import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface Props {
  isReceived?: boolean;
}

const MessageCard: FC<Props> = ({ isReceived }) => {
  return (
    <div
      className={cn(
        "m-2.5 font-medium text-xs flex",
        isReceived ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={cn(
          "relative inline p-2 pl-2.5 pr-12 max-w-full",
          isReceived ? "bg-primary" : "bg-secondary",
        )}
      >
        <p className="text-sm text-white">Hello world</p>
        <span className="text-xs absolute bottom-0 right-1 opacity-60">✓</span>
      </div>
    </div>
  );
};

export default MessageCard;
