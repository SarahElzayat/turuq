import { Request, Response } from "express";
import { User } from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import { NotFoundError } from "../utils/ApiError";
import { buildPaginationMeta, parsePagination } from "../utils/pagination";
import { CreateUserInput, ListUsersQuery, UpdateUserInput } from "../validators/user.validators";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, age } = req.body as CreateUserInput;
  const user = await User.create({ name, email, age });
  res.status(201).json(user);
});

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const { page: rawPage, limit: rawLimit, age } = req.query as unknown as ListUsersQuery;
  const { page, limit, skip } = parsePagination(rawPage, rawLimit);

  const filter = age !== undefined ? { age } : {};

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    data: items,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(user);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updates = req.body as UpdateUserInput;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new NotFoundError("User not found");
  res.status(204).send();
});
