import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/ApiError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}
