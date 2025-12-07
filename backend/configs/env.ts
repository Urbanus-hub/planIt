import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Try to load environment-specific file first, then fall back to .env
const envFile = `.env.${process.env.NODE_ENV || "development"}.mode`;
const envPath = resolve(process.cwd(), envFile);
const defaultEnvPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (existsSync(defaultEnvPath)) {
  dotenv.config({ path: defaultEnvPath });
} else {
  dotenv.config(); // Let dotenv use default behavior
}

interface EnvConfig {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  CLIENT_URL?: string;
}

const { PORT, MONGO_URI, JWT_SECRET, NODE_ENV, CLIENT_URL } =
  process.env as unknown as EnvConfig;

if (!MONGO_URI || !JWT_SECRET) {
  throw new Error(
    "Missing required environment variables: MONGO_URI and/or JWT_SECRET"
  );
}

export { PORT, MONGO_URI, JWT_SECRET, NODE_ENV, CLIENT_URL };
