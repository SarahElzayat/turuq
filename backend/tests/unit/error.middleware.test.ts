import mongoose from "mongoose";
import { Response } from "express";
import { errorHandler } from "../../src/middleware/error.middleware";
import { NotFoundError } from "../../src/utils/ApiError";

function mockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler", () => {
  it("handles ApiError with its own status code", () => {
    const res = mockRes();
    errorHandler(new NotFoundError("User not found"), {} as never, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "User not found", details: undefined } });
  });

  it("handles Mongoose ValidationError as 400 with field details", () => {
    const res = mockRes();
    const validationError = new mongoose.Error.ValidationError();
    validationError.errors.name = new mongoose.Error.ValidatorError({
      message: "Name is required",
      path: "name",
    });

    errorHandler(validationError, {} as never, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Validation failed", details: { name: "Name is required" } },
    });
  });

  it("handles Mongoose CastError as 400", () => {
    const res = mockRes();
    const castError = new mongoose.Error.CastError("ObjectId", "not-an-id", "id");

    errorHandler(castError, {} as never, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles a Mongo duplicate-key error as 409", () => {
    const res = mockRes();
    const dupError = Object.assign(new Error("duplicate"), {
      code: 11000,
      keyValue: { email: "jane@example.com" },
    });

    errorHandler(dupError, {} as never, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "email already exists" } });
  });

  it("handles unknown errors as 500", () => {
    const res = mockRes();

    errorHandler(new Error("some internal detail"), {} as never, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    // env.NODE_ENV is "test" for the whole suite (env is snapshotted at import
    // time), so the message passes through here; production redaction is a
    // one-line `env.NODE_ENV === "production"` check in error.middleware.ts.
    expect(res.json).toHaveBeenCalledWith({ error: { message: "some internal detail" } });
  });
});
