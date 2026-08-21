import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { URI_FILE } from "./mongoInstance";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.SEED_API_KEY = "test-seed-key";
process.env.CORS_ORIGIN = "*";
process.env.MONGO_URI = readFileSync(URI_FILE, "utf-8").trim();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI as string);
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
