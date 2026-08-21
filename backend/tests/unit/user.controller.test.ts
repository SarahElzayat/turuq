import { Request, Response } from "express";
import { User } from "../../src/models/user.model";
import { createUser, getUser, listUsers } from "../../src/controllers/user.controller";
import { NotFoundError } from "../../src/utils/ApiError";

jest.mock("../../src/models/user.model");

function mockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("user.controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createUser", () => {
    it("creates a user and responds 201", async () => {
      const created = { id: "1", name: "Jane", email: "jane@example.com" };
      (User.create as jest.Mock).mockResolvedValue(created);

      const req = { body: { name: "Jane", email: "jane@example.com" } } as Request;
      const res = mockRes();

      await createUser(req, res, jest.fn());

      expect(User.create).toHaveBeenCalledWith({ name: "Jane", email: "jane@example.com", age: undefined });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe("listUsers", () => {
    it("applies the age filter and pagination to the query", async () => {
      const find = { sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([]) };
      (User.find as jest.Mock).mockReturnValue(find);
      (User.countDocuments as jest.Mock).mockResolvedValue(0);

      const req = { query: { page: 2, limit: 5, age: 30 } } as unknown as Request;
      const res = mockRes();

      await listUsers(req, res, jest.fn());

      expect(User.find).toHaveBeenCalledWith({ age: 30 });
      expect(User.countDocuments).toHaveBeenCalledWith({ age: 30 });
      expect(find.skip).toHaveBeenCalledWith(5);
      expect(find.limit).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("omits the age filter when not provided", async () => {
      const find = { sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([]) };
      (User.find as jest.Mock).mockReturnValue(find);
      (User.countDocuments as jest.Mock).mockResolvedValue(0);

      const req = { query: {} } as unknown as Request;
      const res = mockRes();

      await listUsers(req, res, jest.fn());

      expect(User.find).toHaveBeenCalledWith({});
    });
  });

  describe("getUser", () => {
    it("forwards a NotFoundError to next() when the user does not exist", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const req = { params: { id: "507f1f77bcf86cd799439011" } } as unknown as Request;
      const res = mockRes();
      const next = jest.fn();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it("returns the user when found", async () => {
      const found = { id: "1", name: "Jane" };
      (User.findById as jest.Mock).mockResolvedValue(found);

      const req = { params: { id: "507f1f77bcf86cd799439011" } } as unknown as Request;
      const res = mockRes();

      await getUser(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(found);
    });
  });
});
