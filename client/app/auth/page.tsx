import React from "react";
import { FaTelegram } from "react-icons/fa";
import StateAuth from "./_components/state";
import Social from "./_components/social";
import { ModeToggle } from "@/components/shared/modeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-linear-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-background/85 dark:bg-card/80 backdrop-blur-md rounded-3xl border border-border shadow-2xl p-8 flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FaTelegram size={52} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Telegram</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Sign in to continue
            </p>
          </div>
        </div>

        {/* Auth form */}
        <div className="w-full">
          <StateAuth />
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social buttons */}
        <div className="w-full">
          <Social />
        </div>
      </div>
    </div>
  );
};

export default page;
