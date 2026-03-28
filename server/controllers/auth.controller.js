import BaseError from "../errors/base.error.js";
import { UserModel } from "../models/user.model.js";
import MailService from "../services/mail.service.js";

class AuthController {
  constructor() {
    this.mailService = new MailService();
  }

  async login(req, res, next) {
    try {
      const { email, firstName, lastName } = req.body;
      await this.mailService.sendOtp(email);
      // const existUser = await UserModel.findOne({ email });
      // if (existUser)
      //   throw BaseError.BadRequest("user already exists", {
      //     email: "user already exists",
      //   });

      // const createdUser = await UserModel.create({
      //   email,
      //   firstName,
      //   lastName,
      // });

      res.status(201).json({ email });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    const { email, otp } = req.body;
    res.json({ email, otp });
  }
}

export default AuthController;
