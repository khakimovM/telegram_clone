import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: "5m" } },
  },
  { timestamps: true },
);

export const OtpModel = mongoose.model("Otp", otpSchema);
