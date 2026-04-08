import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const UserRouter = Router();
const controller = new UserController();

UserRouter.get(
  "/messages/:contactId",
  authMiddleware,
  controller.getMessages.bind(controller),
);
UserRouter.get(
  "/contacts",
  authMiddleware,
  controller.getContacts.bind(controller),
);

UserRouter.post(
  "/message",
  authMiddleware,
  controller.createMessage.bind(controller),
);
UserRouter.post(
  "/contact",
  authMiddleware,
  controller.createContact.bind(controller),
);
UserRouter.post(
  "/reaction",
  authMiddleware,
  controller.createReaction.bind(controller),
);
UserRouter.post(
  "/send-otp",
  authMiddleware,
  controller.sendOtp.bind(controller),
);
UserRouter.post(
  "/message-read",
  authMiddleware,
  controller.messageRead.bind(controller),
);

UserRouter.put(
  "/message/:messageId",
  authMiddleware,
  controller.updateMessage.bind(controller),
);
UserRouter.put(
  "/profile",
  authMiddleware,
  controller.updateProfile.bind(controller),
);
UserRouter.put(
  "/email",
  authMiddleware,
  controller.updateEmail.bind(controller),
);

UserRouter.delete(
  "/message/:messageId",
  authMiddleware,
  controller.deleteMessage.bind(controller),
);
UserRouter.delete("/", authMiddleware, controller.deleteUser.bind(controller));

export default UserRouter;
