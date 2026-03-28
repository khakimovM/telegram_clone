import AuthRouter from "./auth.route.js";
import express from "express";
import UserRouter from "./user.route.js";

const rootRouter = express.Router();

rootRouter.use("/auth", AuthRouter);
rootRouter.use("/user", UserRouter);

export default rootRouter;
