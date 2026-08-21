import { rmSync } from "node:fs";
import { stopMongo, URI_FILE } from "./mongoInstance";

export default async function globalTeardown(): Promise<void> {
  await stopMongo();
  rmSync(URI_FILE, { force: true });
}
