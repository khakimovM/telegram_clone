"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import ContactList from "./_components/ContactList";
import { useRouter } from "next/navigation";
import AddContact from "./_components/AddContact";
import { useCurrentContact } from "@/hooks/use-current";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { emailSchema, messageSchema } from "@/lib/validation";
import TopChat from "./_components/TopChat";
import Chat from "./_components/Chat";

const Homepage = () => {
  const router = useRouter();
  const { currentContact, setCurrentContact } = useCurrentContact();

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      text: "",
      image: "",
    },
  });

  const onSendMessage = (value: z.infer<typeof messageSchema>) => {
    // API call to message
    console.log(value);
  };

  const onCreateContact = (value: z.infer<typeof emailSchema>) => {
    // API calling

    console.log(value);
  };

  useEffect(() => {
    router.replace("/");
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className="w-80 h-screen border-r inset-0 fixed z-50">
        {/* Loading */}
        {/* <div className="w-full h-[95vh] flex justify-center items-center">
          <Loader2 size={50} className="animate-spin" />
        </div> */}

        {/* Contact List */}
        <ContactList contacts={contacts} />
      </div>

      {/* Chat area*/}
      <div className="pl-80 w-full">
        {/* Add contact */}

        {!currentContact?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {/* Chat */}

        {currentContact?._id && (
          <div className="w-full relative">
            {/* Top chat */}
            <TopChat />
            {/* Chat message */}
            <Chat messageForm={messageForm} onSendMessage={onSendMessage} />
          </div>
        )}
      </div>
    </>
  );
};

const contacts = [
  {
    email: "ali@gmail.com",
    _id: "1",
    avatar: "https://github.com/shadcn.png",
    firstName: "Ali",
    lastName: "Zoirov",
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quae voluptatibus animi aspernatur suscipit exercitationem, consectetur officiis ut quisquam deleniti facere dolores placeat doloremque accusantium ad saepe aliquam quam molestiae?",
  },
  { email: "vali@gmail.com", _id: "2" },
  { email: "hasan@gmail.com", _id: "3" },
  { email: "husan@gmail.com", _id: "4" },
  { email: "asad@gmail.com", _id: "5" },
  { email: "komil@gmail.com", _id: "6" },
  { email: "akrom@gmail.com", _id: "7" },
  { email: "dilshod@gmail.com", _id: "8" },
  { email: "bekzod@gmail.com", _id: "9" },
  { email: "jamshid@gmail.com", _id: "10" },
];

export default Homepage;
