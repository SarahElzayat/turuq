import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { requireAuth, AuthenticatedRequest } from "../../src/middleware/auth.middleware";
import { UnauthorizedError } from "../../src/utils/ApiError";

function mockRes(): Response {
  return {} as Response;
}

describe("requireAuth", () => {
  it("rejects a request with no Authorization header", () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const next = jest.fn() as NextFunction;

    requireAuth(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("rejects a malformed Authorization header", () => {
    const req = { headers: { authorization: "Token abc" } } as AuthenticatedRequest;
    const next = jest.fn() as NextFunction;

    requireAuth(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("rejects an invalid token", () => {
    const req = { headers: { authorization: "Bearer not-a-real-token" } } as AuthenticatedRequest;
    const next = jest.fn() as NextFunction;

    requireAuth(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("rejects an expired token", () => {
    const token = jwt.sign({ sub: "assessment-client" }, process.env.JWT_SECRET as string, {
      expiresIn: -10,
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthenticatedRequest;
    const next = jest.fn() as NextFunction;

    requireAuth(req, mockRes(), next);

    const err = (next as jest.Mock).mock.calls[0][0] as UnauthorizedError;
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect(err.message).toMatch(/expired/i);
  });

  it("attaches the decoded payload and calls next() for a valid token", () => {
    const token = jwt.sign({ sub: "assessment-client" }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthenticatedRequest;
    const next = jest.fn() as NextFunction;

    requireAuth(req, mockRes(), next);

    expect(req.auth?.sub).toBe("assessment-client");
    expect(next).toHaveBeenCalledWith();
  });
});
