import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  SEED_API_KEY: z.string().min(1, "SEED_API_KEY is required"),
  CORS_ORIGIN: z.string().default("*"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. Check your .env file against .env.example.");
}

export const env = parsed.data;
