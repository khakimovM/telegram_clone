import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const AuthRouter = Router();
const controller = new AuthController();

AuthRouter.post("/login", controller.login.bind(controller));
AuthRouter.post("/verify", controller.verify.bind(controller));

export default AuthRouter;
