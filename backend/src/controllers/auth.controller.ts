import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { catchAsync } from "../utils/catchAsync";
import { UnauthorizedError } from "../utils/ApiError";
import { TokenRequestInput } from "../validators/auth.validators";

// Minimal demo credential exchange: this assessment only requires the User
// endpoints to be JWT-protected, not a full registration/login system, so a
// single shared seed key stands in for "a real user" — see README.
export const issueToken = catchAsync(async (req: Request, res: Response) => {
  const { apiKey } = req.body as TokenRequestInput;

  if (apiKey !== env.SEED_API_KEY) {
    throw new UnauthorizedError("Invalid apiKey");
  }

  const token = jwt.sign({ sub: "assessment-client" }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  res.status(200).json({ token, expiresIn: env.JWT_EXPIRES_IN });
});
