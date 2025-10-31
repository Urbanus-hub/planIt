import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected in ${NODE_ENV} mode`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error connecting to db: ${errorMessage}`);
    process.exit(1); // 1 means there was an error
  }
};

export default connectDB;
