import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";
import { notFoundHandler } from "./middleware/notFound.middleware";
import { errorHandler } from "./middleware/error.middleware";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    })
  );
  app.use(compression());
  app.use(express.json());
  app.use(mongoSanitize());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
