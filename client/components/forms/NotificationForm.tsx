import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, Ghost, PlayCircle } from "lucide-react";
import { SOUNDS } from "@/lib/constants";
import { cn, getSoundLabel } from "@/lib/utils";
import useAudio from "@/hooks/use-audio";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/generate-token";
import { Session } from "inspector/promises";
import { axiosClient } from "@/http/axios";
import { toast } from "sonner";

const NotificationForm = () => {
  let [selectedSound, setSelectedSound] = useState("");
  let [isNotification, setIsNotification] = useState(false);
  let [isSounding, setIsSounding] = useState(false);

  const { playSound } = useAudio();
  const { data: session, update } = useSession();

  const onPlaySound = (value: string) => {
    setSelectedSound(value);
    playSound(value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: INotificationPayload) => {
      const token = await generateToken(session?.currentUser._id);
      const { data } = await axiosClient.put("/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    },

    onSuccess: () => {
      toast.success("Notification updates");
      update();
      setIsNotification(false);
      setIsSounding(false);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p className="font-spaceGrotest">Notification Sound</p>
          <p className="font-spaceGrotest text-muted-foreground text-xs">
            {getSoundLabel(session?.currentUser.notificationSound)}
          </p>
        </div>

        <Popover open={isNotification} onOpenChange={setIsNotification}>
          <PopoverTrigger asChild>
            <Button size={"sm"}>
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 absolute -right-12">
            <div className="flex flex-col space-y-1">
              {SOUNDS.map((sound) => (
                <div
                  className={cn(
                    "flex justify-between items-center bg-secondary cursor-pointer hover:bg-sidebar-border",
                    selectedSound === sound.value && "bg-sidebar-border",
                  )}
                  key={sound.label}
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button
                    className="justify-start"
                    size={"sm"}
                    variant={"ghost"}
                  >
                    {sound.label}
                  </Button>

                  {session?.currentUser.notificationSound === sound.value ? (
                    <Button size={"icon"} variant={"secondary"}>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button variant={"ghost"} size={"icon"}>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-2 font-bold "
              disabled={isPending}
              onClick={() => mutate({ notificationSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p className="font-spaceGrotest">Sending Sound</p>
          <p className="font-spaceGrotest text-muted-foreground text-xs">
            {getSoundLabel(session?.currentUser.sendingSound)}
          </p>
        </div>

        <Popover open={isSounding} onOpenChange={setIsSounding}>
          <PopoverTrigger asChild>
            <Button size={"sm"}>
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 absolute -right-12">
            <div className="flex flex-col space-y-1">
              {SOUNDS.map((sound) => (
                <div
                  className={cn(
                    "flex justify-between items-center bg-secondary cursor-pointer hover:bg-sidebar-border",
                    selectedSound === sound.value && "bg-sidebar-border",
                  )}
                  key={sound.label}
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button
                    className="justify-start"
                    size={"sm"}
                    variant={"ghost"}
                  >
                    {sound.label}
                  </Button>

                  {session?.currentUser.sendingSound === sound.value ? (
                    <Button size={"icon"} variant={"secondary"}>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button variant={"ghost"} size={"icon"}>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-2 font-bold"
              onClick={() => mutate({ sendingSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p>Mode Mute</p>
          <p className="text-muted-foreground text-xs">
            {!session?.currentUser.muted ? "Muted" : "Unmuted"}
          </p>
        </div>

        <Switch
          checked={!session?.currentUser.muted}
          disabled={isPending}
          onCheckedChange={() => mutate({ muted: !session?.currentUser.muted })}
        />
      </div>
    </>
  );
};

export default NotificationForm;

interface INotificationPayload {
  notificationSound?: string;
  sendingSound?: string;
  muted?: boolean;
}
