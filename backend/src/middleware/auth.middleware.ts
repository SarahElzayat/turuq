import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../utils/ApiError";

export interface AuthenticatedRequest extends Request {
  auth?: { sub: string; iat: number; exp: number };
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new UnauthorizedError("Missing or malformed Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    req.auth = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest["auth"];
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
      return;
    }
    next(new UnauthorizedError("Invalid token"));
  }
}
