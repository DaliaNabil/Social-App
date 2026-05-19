import mongoose from "mongoose";
import { envConfig } from "../config";

const { database } = envConfig;
export const dbConnection = async () => {
  try {
    await mongoose.connect(database.MONGO_URI);
    console.log(" DB Connected to MongoDB");
  } catch (error) {
    console.error(" DB Error connecting to MongoDB:", error);
  }
};
