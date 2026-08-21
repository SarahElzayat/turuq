import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/user.controller";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamsSchema,
} from "../validators/user.validators";

const router = Router();

// Auth first: an unauthenticated malformed request should 401, not 400.
router.use(requireAuth);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         age: { type: integer }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a user profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               age: { type: integer }
 *           example:
 *             name: Jane Doe
 *             email: jane@example.com
 *             age: 30
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Missing or invalid token
 *       409:
 *         description: Email already exists
 *   get:
 *     summary: List user profiles (paginated, optionally filtered by age)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: age
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: A page of users
 *       401:
 *         description: Missing or invalid token
 */
router.post("/", validate(createUserSchema), createUser);
router.get("/", validate(listUsersQuerySchema, "query"), listUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user profile by id
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The user
 *       400:
 *         description: Invalid id format
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update a user profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               age: { type: integer }
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *   delete:
 *     summary: Delete a user profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 */
router.get("/:id", validate(userIdParamsSchema, "params"), getUser);
router.put("/:id", validate(userIdParamsSchema, "params"), validate(updateUserSchema), updateUser);
router.delete("/:id", validate(userIdParamsSchema, "params"), deleteUser);

export default router;
