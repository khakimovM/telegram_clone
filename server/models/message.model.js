import mongoose, { Schema } from "mongoose";
import { CONST } from "../lib/constants.js";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    status: {
      type: String,
      enum: [CONST.SENT, CONST.DELIVERED, CONST.READ],
      default: CONST.SENT,
    },
    reaction: { type: String },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model("message", messageSchema);
