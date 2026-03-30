import { profileScheme } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const InformationForm = () => {
  const form = useForm<z.infer<typeof profileScheme>>({
    resolver: zodResolver(profileScheme),
    defaultValues: { firstname: "", lastname: "", bio: "" },
  });

  const onSubmit = (data: z.infer<typeof profileScheme>) => {
    // API calling
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <Label>First Name</Label>
              <FormControl>
                <Input {...field} placeholder="Oman" className="bg-secondary" />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <Label>Last Name</Label>
              <FormControl>
                <Input {...field} placeholder="Ali" className="bg-secondary" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <Label>Bio</Label>
              <FormControl>
                <Textarea
                  className="bg-secondary"
                  placeholder="Enter anything about yourself"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default InformationForm;
