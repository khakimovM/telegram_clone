import { CONST } from "../lib/constants.js";
import { MessageModel } from "../models/message.model.js";

class UserService {
  constructor() {
    this.messageModel = MessageModel;
  }

  async createMessage(data) {
    const newMessage = await this.messageModel.create(data);
    const currentMessage = await this.messageModel
      .findById(newMessage._id)
      .populate({ path: "sender", select: "email" })
      .populate({ path: "receiver", select: "email" });
    return { newMessage: currentMessage };
  }

  async getMessages(userId, contactId) {
    const messages = await this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: contactId },
          { sender: contactId, receiver: userId },
        ],
      })
      .populate({ path: "sender", select: "email" })
      .populate({ path: "receiver", select: "email" });

    await this.messageModel.updateMany(
      {
        sender: contactId,
        receiver: userId,
        status: "SENT",
      },
      { staus: CONST.READ },
    );

    return { messages };
  }
}

export default UserService;
