import mongoose from "mongoose";

let isCOnnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) {
    return console.error("MONGO_URL is not defined");
  }

  if (isCOnnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, { autoCreate: true });
    isCOnnected = true;
  } catch (error) {
    console.log("Error connecting to database");
  }
};
