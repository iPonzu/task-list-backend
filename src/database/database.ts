import mongoose from "mongoose";

export const connectiondb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};