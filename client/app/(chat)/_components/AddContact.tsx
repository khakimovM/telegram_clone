import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/hooks/use-loading";
import { emailSchema } from "@/lib/validation";
import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaTelegram } from "react-icons/fa";
import z from "zod";

interface Props {
  contactForm: UseFormReturn<{ email: string }>;
  onCreateContact: (values: z.infer<typeof emailSchema>) => void;
}

const AddContact: FC<Props> = ({ contactForm, onCreateContact }) => {
  const { isCreating } = useLoading();

  return (
    <div className="h-screen w-full flex items-center justify-center chat-background">
      <div className="w-full max-w-sm mx-auto px-6">
        {/* Logo & title */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FaTelegram size={48} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Start Chatting</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add a contact by their email to begin
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-background rounded-2xl shadow-lg border border-border p-5">
          <Form {...contactForm}>
            <form
              onSubmit={contactForm.handleSubmit(onCreateContact)}
              className="space-y-4"
            >
              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="friend@example.com"
                        className="h-10 rounded-xl bg-secondary border-transparent focus-visible:ring-primary/40"
                        disabled={isCreating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-xl h-10 bg-primary hover:bg-primary/90 font-semibold"
                disabled={isCreating}
              >
                {isCreating ? "Adding..." : "Add Contact"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
