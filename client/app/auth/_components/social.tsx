import { Button } from "@/components/ui/button";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Social = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-1">
      <Button variant={"outline"}>
        <span>Sign up with Google</span>
        <FaGoogle />
      </Button>
      <Button variant={"outline"}>
        <span>Sign up with GitHub</span>
        <FaGithub />
      </Button>
    </div>
  );
};

export default Social;
