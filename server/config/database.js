import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db_url = process.env.MONGO_URL;
    await mongoose.connect(db_url);
    console.log("Database connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
