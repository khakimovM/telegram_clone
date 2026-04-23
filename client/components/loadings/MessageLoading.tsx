import { cn } from "@/lib/utils";
import { FC } from "react";
import { Skeleton } from "../ui/skeleton";

interface Props {
  isReceived?: boolean;
}

const MessageLoading: FC<Props> = ({ isReceived }) => {
  return (
    <div
      className={cn(
        "mx-3 my-1 font-medium text-xs flex",
        isReceived ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={cn(
          "relative p-2.5 pl-3 pr-12 shadow-sm",
          isReceived
            ? "bg-primary/20 rounded-2xl rounded-tl-sm"
            : "bg-secondary/40 rounded-2xl rounded-tr-sm",
        )}
      >
        <Skeleton className="w-36 h-4 rounded-md" />
        <span className="text-[10px] right-2 bottom-1 absolute opacity-40">
          ✓
        </span>
      </div>
    </div>
  );
};

export default MessageLoading;
