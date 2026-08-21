import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<typeof mongoose> {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  return mongoose.connect(env.MONGO_URI);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
