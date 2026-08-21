import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        jest: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
      },
    },
  },
  {
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
];
