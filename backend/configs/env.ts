import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.mode` });

interface EnvConfig {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const { PORT, MONGO_URI, JWT_SECRET, NODE_ENV } =
  process.env as unknown as EnvConfig;

if (!MONGO_URI || !JWT_SECRET) {
  throw new Error(
    "Missing required environment variables: MONGO_URI and/or JWT_SECRET"
  );
}

export { PORT, MONGO_URI, JWT_SECRET, NODE_ENV };
