import { Router } from "express";
import rateLimit from "express-rate-limit";
import { issueToken } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { tokenRequestSchema } from "../validators/auth.validators";

const router = Router();

// Tighter limit than the global one since this is the credential-guessing surface.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/token:
 *   post:
 *     summary: Exchange a seed API key for a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [apiKey]
 *             properties:
 *               apiKey:
 *                 type: string
 *           example:
 *             apiKey: change-this-seed-key
 *     responses:
 *       200:
 *         description: Token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Invalid apiKey
 */
router.post("/token", authLimiter, validate(tokenRequestSchema), issueToken);

export default router;
