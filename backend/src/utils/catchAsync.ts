import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function catchAsync(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    // Returning the promise (rather than fire-and-forget) lets tests `await`
    // a wrapped handler directly; Express itself ignores the return value.
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}
