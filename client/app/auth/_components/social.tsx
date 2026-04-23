"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Social = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="grid grid-cols-2 w-full gap-2 px-1">
      <Button
        variant={"outline"}
        onClick={() => onSignIn("google")}
        disabled={isLoading}
        className="rounded-xl h-10 gap-2"
      >
        <FaGoogle />
        <span>Google</span>
      </Button>
      <Button
        variant={"outline"}
        onClick={() => onSignIn("github")}
        disabled={isLoading}
        className="rounded-xl h-10 gap-2"
      >
        <FaGithub />
        <span>GitHub</span>
      </Button>
    </div>
  );
};

export default Social;
