import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

// Mounted last: every route/middleware error funnels through here so the
// response shape is consistent regardless of where the error originated.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
    res.status(400).json({ error: { message: "Validation failed", details } });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: { message: `Invalid ${err.path}: ${err.value}` } });
    return;
  }

  if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    res.status(409).json({ error: { message: `${field} already exists` } });
    return;
  }

  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({
    error: { message: env.NODE_ENV === "production" ? "Internal server error" : message },
  });
}
