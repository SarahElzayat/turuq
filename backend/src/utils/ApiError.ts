export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource already exists", details?: unknown) {
    super(409, message, details);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request", details?: unknown) {
    super(400, message, details);
    this.name = "BadRequestError";
  }
}
