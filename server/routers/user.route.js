import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const UserRouter = Router();
const controller = new UserController();

UserRouter.get("/messages/:contactId", controller.getMessages.bind(controller));
UserRouter.get("/contacts", controller.getContacts.bind(controller));

UserRouter.post("/message", controller.createMessage.bind(controller));
UserRouter.post("/contact", controller.createContact.bind(controller));
UserRouter.post("/reaction", controller.createReaction.bind(controller));
UserRouter.post("/send-otp", controller.sendOtp.bind(controller));
UserRouter.post("/message-read", controller.messageRead.bind(controller));

UserRouter.put(
  "/message/:messageId",
  controller.updateMessage.bind(controller),
);
UserRouter.put("/profile", controller.updateProfile.bind(controller));
UserRouter.put("/email", controller.updateEmail.bind(controller));

UserRouter.delete(
  "/message/:messageId",
  controller.deleteMessage.bind(controller),
);
UserRouter.delete("/", controller.deleteUser.bind(controller));

export default UserRouter;
