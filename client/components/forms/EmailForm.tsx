import { oldEmailSchema, otpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const EmailForm = () => {
  const [verify, setVerify] = useState(false);

  const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
    resolver: zodResolver(oldEmailSchema),
    defaultValues: { email: "", oldEmail: "codewithaziz@gmail.com" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", email: "" },
  });

  const onEmailSubmit = (values: z.infer<typeof oldEmailSchema>) => {
    console.log(values);
    otpForm.setValue("email", values.email);
    setVerify(true);
  };

  const onVerifySubmit = (values: z.infer<typeof otpForm>) => {
    console.log(values);
  };

  return !verify ? (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-2"
      >
        <FormField
          control={emailForm.control}
          name="oldEmail"
          render={({ field }) => (
            <FormItem>
              <Label>Current email</Label>
              <FormControl>
                <Input className="h-10 bg-secondary" disabled {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Enter a new Email</Label>
              <FormControl>
                <Input
                  placeholder="CodeWithAziz"
                  className="h-10 bg-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Verify email
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(onVerifySubmit)}
        className="space-y-2"
      >
        <Label>New email</Label>
        <Input
          className="h-10 bg-secondary"
          disabled
          value={emailForm.watch("email")}
        />

        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <Label>One-Time password</Label>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="w-full border-input" />
                    <InputOTPSlot index={1} className="w-full border-input" />
                    <InputOTPSlot index={2} className="w-full border-input" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={3} className="w-full border-input" />
                    <InputOTPSlot index={4} className="w-full border-input" />
                    <InputOTPSlot index={5} className="w-full border-input" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default EmailForm;
