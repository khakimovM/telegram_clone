import BaseError from "../errors/base.error.js";
import { UserModel } from "../models/user.model.js";
import AuthService from "../services/auth.service.js";
import MailService from "../services/mail.service.js";

class AuthController {
  constructor() {
    this.mailService = new MailService();
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const { email, firstName, lastName } = req.body;
      const ans = await this.authService.login({ email });

      res.status(201).json(ans);
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const { email, otp } = req.body;
      const ans = await this.authService.verify(email, otp);
      res.status(200).json(ans);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
