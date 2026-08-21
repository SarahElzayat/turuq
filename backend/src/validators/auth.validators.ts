import { z } from "zod";

export const tokenRequestSchema = z.object({
  apiKey: z.string().trim().min(1, "apiKey is required"),
});

export type TokenRequestInput = z.infer<typeof tokenRequestSchema>;
