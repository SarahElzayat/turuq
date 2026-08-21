import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { BadRequestError } from "../utils/ApiError";

type ValidationTarget = "body" | "query" | "params";

/**
 * Runs a zod schema against the given request part and replaces it with the
 * parsed (and type-coerced) result, so downstream handlers get typed, clean
 * input. Failures short-circuit to the centralized error handler as a 400.
 */
export function validate(schema: ZodTypeAny, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(new BadRequestError("Validation failed", result.error.flatten().fieldErrors));
      return;
    }

    req[target] = result.data;
    next();
  };
}
