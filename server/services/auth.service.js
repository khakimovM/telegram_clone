import { UserModel } from "../models/user.model.js";
import CustomError from "../utils/custom.error.js";
import MailService from "./mail.service.js";

class AuthService {
  constructor() {
    this.userModel = UserModel;
    this.mailService = new MailService();
  }

  async login({ email }) {
    try {
      const existUser = await this.userModel.findOne({ email });

      if (!existUser) {
        let newUser = await this.userModel.create({ email });
        await this.mailService.sendOtp(email);

        return { email: newUser.email };
      } else {
        await this.mailService.sendOtp(email);

        return { email: existUser.email };
      }
    } catch (error) {
      throw new CustomError(error.message, error.status || 500);
    }
  }

  async verify(email, otp) {
    try {
      const result = await this.mailService.verifyOtp(email, otp);

      if (!result) throw new CustomError("Otp is not matched", 400);

      const user = await this.userModel.findOneAndUpdate(
        { email },
        { isVerified: true },
        { returnDocument: "after" },
      );
      return { user };
    } catch (error) {
      throw new CustomError(error.message, error.status);
    }
  }
}

export default AuthService;
