import { MongoMemoryServer } from "mongodb-memory-server";
import path from "node:path";
import os from "node:os";

// globalSetup and globalTeardown run in the same (single) Jest orchestrator
// process, so this module-level singleton is how the instance started in
// setup gets stopped in teardown.
let mongod: MongoMemoryServer | null = null;

export const URI_FILE = path.join(os.tmpdir(), "turuq-backend-test-mongo-uri.txt");

export async function startMongo(): Promise<string> {
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}

export async function stopMongo(): Promise<void> {
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}
