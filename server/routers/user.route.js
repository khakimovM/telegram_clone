import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const UserRouter = Router();
const controller = new UserController();

UserRouter.post("/create-message", controller.createMessage.bind(controller));
UserRouter.get("/messages/:contactId", controller.getMessages.bind(controller));

export default UserRouter;
