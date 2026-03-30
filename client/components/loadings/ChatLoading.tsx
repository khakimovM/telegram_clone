import React from "react";
import MessageLoading from "./MessageLoading";

const ChatLoading = () => {
  return (
    <>
      <MessageLoading isReceived />
      <MessageLoading />
      <MessageLoading isReceived />
    </>
  );
};

export default ChatLoading;
