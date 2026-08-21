import { writeFileSync } from "node:fs";
import { startMongo, URI_FILE } from "./mongoInstance";

export default async function globalSetup(): Promise<void> {
  const uri = await startMongo();
  writeFileSync(URI_FILE, uri, "utf-8");
}
