import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  globalSetup: "<rootDir>/tests/setup/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/setup/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/setupAfterEnv.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  testTimeout: 30000,
};

export default config;
