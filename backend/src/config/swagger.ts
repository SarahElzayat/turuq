import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Profile API",
      version: "1.0.0",
      description:
        "Backend Technical Assessment — Task 1: JWT-protected CRUD API for User Profiles.",
    },
    servers: [
      {
        url:
          process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`,
        description:
          process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
});
