"use server";

import jwt from "jsonwebtoken";

export const generateToken = async (userId?: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1m",
  });

  return token;
};
