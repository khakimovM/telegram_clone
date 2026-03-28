import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, reqired: true, unique: true },
  isVerified: { type: Boolean, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  muted: { type: Boolean, default: false },
  notificationSound: { type: String, default: "notification.mp3" },
  sendingSound: { type: String, default: "sending.mp3" },
});

export const UserModel = mongoose.model("Users", userSchema);
