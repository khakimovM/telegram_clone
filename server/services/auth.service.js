import { UserModel } from "../models/user.model.js";
import CustomError from "../utils/custom.error.js";

class AuthService {
  constructor() {
    this.userModel = UserModel;
  }

  async login({ email }) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new CustomError("this user already existed", 409);
  }
}

export default AuthService;
