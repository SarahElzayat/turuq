import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function main(): Promise<void> {
  await connectDB();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
    console.log(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
