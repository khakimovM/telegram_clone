import { CONST } from "../lib/constants.js";
import { MessageModel } from "../models/message.model.js";
import { UserModel } from "../models/user.model.js";
import CustomError from "../utils/custom.error.js";
import MailService from "./mail.service.js";

class UserService {
  constructor() {
    this.messageModel = MessageModel;
    this.userModel = UserModel;
    this.mailService = new MailService();
  }

  // GET
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
      { status: CONST.READ },
    );

    return { messages };
  }

  async getContacts(userId) {
    const existsUser = await this.userModel
      .findById(userId)
      .populate("contacts");
    if (!existsUser) throw new CustomError("User not found", 404);

    const allContacts = existsUser.contacts.map((contact) =>
      contact.toObject(),
    );

    for (const contact of allContacts) {
      const lastMessage = await this.messageModel
        .findOne({
          $or: [
            { sender: userId, receiver: contact._id },
            { sender: contact._id, receiver: userId },
          ],
        })
        .populate({ path: "sender" })
        .populate({ path: "receiver" })
        .sort({ createdAt: -1 });

      console.log(lastMessage);

      contact.lastMessage = lastMessage;
    }

    return { contacts: allContacts };
  }

  // POST
  async createMessage(data) {
    const newMessage = await this.messageModel.create(data);
    const currentMessage = await this.messageModel
      .findById(newMessage._id)
      .populate({ path: "sender", select: "email" })
      .populate({ path: "receiver", select: "email" });
    return { newMessage: currentMessage };
  }

  async createContact(userId, contactEmail) {
    const user = await this.userModel.findById(userId);
    const contact = await this.userModel.findOne({ email: contactEmail });

    if (!contact)
      throw new CustomError("User with this email doesn't exist", 404);
    if (user.email === contact.email)
      throw new CustomError("You cannot add yourself as a contact", 400);

    const existContact = await this.userModel.findOne({
      _id: userId,
      contacts: contact._id,
    });

    if (existContact)
      throw new CustomError("This contact is already in your list", 400);

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { contacts: contact._id },
    });
    const addedContact = await this.userModel.findByIdAndUpdate(
      contact._id,
      {
        $push: { contacts: userId },
      },
      { returnDocument: "after" },
    );

    return { message: "Contact added succesfully", contact: addedContact };
  }

  async createReaction(messageId, reaction) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new CustomError("message not found", 404);

    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      { reaction },
      { returnDocument: "after" },
    );

    return { updatedMessage };
  }

  async sendOtp(email) {
    const user = await this.userModel.findOne({ email });

    if (user) throw new CustomError("User with this email already exist", 409);

    try {
      await this.mailService.sendOtp(email);
    } catch (error) {
      throw new CustomError(`error with smtp: ${error.message}`, 500);
    }

    return { message: "Otp sent succesfully" };
  }

  async messageRead(messages) {
    const allMessages = [];

    for (let message of messages) {
      const updatedMessage = await this.messageModel.findByIdAndUpdate(
        message._id,
        { status: CONST.READ },
        { returnDocument: "after" },
      );
      allMessages.push(updatedMessage);
    }

    return { messages: allMessages };
  }

  // PUT
  async updateMessage(messageId, text) {
    const existMessage = await this.messageModel.findById(messageId);
    if (!existMessage) throw new CustomError("Message not found", 404);

    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      { text },
      { returnDocument: "after" },
    );

    return { updatedMessage };
  }

  async updateProfile(userId, payload) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    await this.userModel.findByIdAndUpdate(userId, payload);

    return { message: "Profile updated succesfully" };
  }

  async updateEmail(userId, email, otp) {
    const existsEmail = await this.userModel.findOne({ email });
    if (existsEmail) throw new CustomError("this email already existed", 409);

    const check = await this.mailService.verifyOtp(email, otp);

    if (!check) throw new CustomError("OTP is invalid", 400);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { email },
      { returnDocument: "after" },
    );

    return { user: updatedUser };
  }

  // DELETE
  async deleteMessage(messageId) {
    await this.messageModel.findByIdAndDelete(messageId);
    return { message: "Message succesfully deleted" };
  }

  async deleteUser(userId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    await this.userModel.findByIdAndDelete(userId);

    return { message: "User succesfully deleted" };
  }
}

export default UserService;
