import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email format"),
  age: z.coerce.number().int().min(0).max(150).optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.string().trim().email("Invalid email format").optional(),
    age: z.coerce.number().int().min(0).max(150).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name, email, age) must be provided",
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
});

export const userIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
