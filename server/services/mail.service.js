import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { OtpModel } from "../models/otp.model.js";
import CustomError from "../utils/custom.error.js";

class MailService {
  constructor() {
    this.otpModel = OtpModel;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(to) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const hashedOtp = await bcrypt.hash(otp.toString(), 12);

    await this.otpModel.create({
      email: to,
      otp: hashedOtp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `OTP for verification ${new Date().toLocaleString()}`,
      html: `
      <h1>Your otp is ${otp}</h1>`,
    });
  }

  async verifyOtp(email, otp) {
    const otpData = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 });

    if (!otpData) throw new CustomError("Otp not found", 404);

    const isValid = await bcrypt.compare(otp.toString(), otpData.otp);

    if (!isValid) throw new CustomError("Invalid otp entered", 400);

    await this.otpModel.deleteMany({ email });

    return true;
  }
}

export default MailService;
