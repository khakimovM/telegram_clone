import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const UserRouter = Router();
const controller = new UserController();

export default UserRouter;
