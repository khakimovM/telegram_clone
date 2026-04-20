import DangerZoneForm from "@/components/forms/DangerZoneForm";
import EmailForm from "@/components/forms/EmailForm";
import InformationForm from "@/components/forms/InformationForm";
import NotificationForm from "@/components/forms/NotificationForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { axiosClient } from "@/http/axios";
import { generateToken } from "@/lib/generate-token";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Settings2,
  Sun,
  Upload,
  UserPlus,
  VolumeOff,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, update } = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: IPayload) => {
      const token = await generateToken(session?.currentUser._id);
      const { data } = await axiosClient.put("/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    },

    onSuccess: () => {
      toast.success("Notification updates");
      update();
    },
  });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"icon"} variant={"secondary"}>
            <Menu />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80">
          <h2 className="pt-3 pl-2 text-muted-foreground text-sm">
            Settings:{" "}
            <span className="text-white">{session?.currentUser.email}</span>
          </h2>

          <Separator className="mt-2" />

          <div className="flex flex-col">
            <div
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <Settings2 size={16} />
                <span className="text-sm">Profile</span>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <div className="flex items-center gap-1">
                <UserPlus size={16} />
                <span className="text-sm">Create Contact</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer">
              <div className="flex items-center gap-1">
                <VolumeOff size={16} />
                <span className="text-sm">Mute</span>
              </div>
              <Switch
                checked={!session?.currentUser.muted}
                disabled={isPending}
                onCheckedChange={() =>
                  mutate({ muted: !session?.currentUser.muted })
                }
              />
            </div>

            <div className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer">
              <div className="flex items-center gap-1">
                {resolvedTheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                )}
                <span className="text-sm">
                  {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                </span>
              </div>
              <Switch
                checked={resolvedTheme === "dark" ? true : false}
                onCheckedChange={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              />
            </div>

            <div
              className="flex items-center justify-between bg-destructive p-2 hover:bg-secondary cursor-pointer"
              onClick={() => signOut()}
            >
              <div className="flex items-center gap-1">
                <LogIn size={16} />
                <span className="text-sm">LogOut</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent side={"left"} className="w-80 ">
          <SheetHeader>
            <SheetTitle className="text-2xl">My profile</SheetTitle>
            <SheetDescription>This action cannot be undone.</SheetDescription>
          </SheetHeader>

          <Separator />

          <div className="mx-auto w-36 h-36 relative">
            <Avatar className="w-full h-36">
              <AvatarImage
                src={session?.currentUser.avatar}
                alt={session?.currentUser.email}
                className="object-cover"
              />
              <AvatarFallback className="text-6xl uppercase font-spaceGrotest">
                {session?.currentUser.email.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <UploadButton
              endpoint={"imageUploader"}
              onClientUploadComplete={(res) => {
                console.log(res);
                mutate({ avatar: res[0].url });
              }}
              config={{ appendOnPaste: true, mode: "auto" }}
              className="absolute right-0 bottom-0 bg-primary rounded-full"
              appearance={{
                allowedContent: { display: "none" },
                button: { width: 40, height: 40, borderRadius: "100%" },
              }}
              content={{
                button({ isUploading }) {
                  if (isUploading) {
                    return <Loader2 size={16} className="animate-spin" />;
                  }
                  return <Upload size={16} />;
                },
              }}
            />

            {/* <Button size={"icon"} className="absolute right-0 bottom-0">
              <Upload size={16} />
            </Button> */}
          </div>

          <Accordion type="single" collapsible className="mt-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-secondary px-2">
                Basic information
              </AccordionTrigger>
              <AccordionContent className="px-2 mt-2">
                <InformationForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="mt-1">
              <AccordionTrigger className="bg-secondary px-2">
                Email
              </AccordionTrigger>
              <AccordionContent className="px-2 mt-2">
                <EmailForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="mt-1">
              <AccordionTrigger className="bg-secondary px-2">
                Notification
              </AccordionTrigger>
              <AccordionContent className="px-2 mt-1">
                <NotificationForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="mt-1">
              <AccordionTrigger className="bg-secondary px-2">
                Danger zone
              </AccordionTrigger>
              <AccordionContent className="px-2 mt-1">
                <DangerZoneForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Settings;

interface IPayload {
  muted?: boolean;
  avatar?: string;
}
