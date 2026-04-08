import { profileScheme } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/http/axios";
import { IUser } from "@/types";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/generate-token";

const InformationForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof profileScheme>>({
    resolver: zodResolver(profileScheme),
    defaultValues: {
      firstName: session?.currentUser.firstName,
      lastName: session?.currentUser.lastName,
      bio: session?.currentUser.bio,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof profileScheme>) => {
      console.log(payload);

      const token = await generateToken(session?.currentUser?._id);
      console.log(token);

      const { data } = await axiosClient.put<{ user: IUser }>(
        "/api/user/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    },

    onSuccess: () => {
      toast.success("Profile updated");
      update();
    },
  });

  const onSubmit = (data: z.infer<typeof profileScheme>) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <Label>First Name</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="CodeWithAziz"
                  disabled={isPending}
                  className="bg-secondary"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <Label>Last Name</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="CodeWithAziz"
                  className="bg-secondary"
                  disabled={isPending}
                />
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
                  disabled={isPending}
                  placeholder="Enter anything about yourself"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default InformationForm;
