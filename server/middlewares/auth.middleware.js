import { UserModel } from "../models/user.model.js";
import CustomError from "../utils/custom.error.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) throw new CustomError("User unauthorized", 401);

    const token = authorization.split(" ")[1];

    if (!token) throw new CustomError("User unauthorized", 401);

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId) throw new CustomError("User unauthorized", 401);

    const user = await UserModel.findById(userId);

    if (!user) throw new CustomError("User unauthorized", 401);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
