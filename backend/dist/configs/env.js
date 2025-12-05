import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.mode` });
const { PORT, MONGO_URI, JWT_SECRET, NODE_ENV, CLIENT_URL } = process.env;
if (!MONGO_URI || !JWT_SECRET) {
    throw new Error("Missing required environment variables: MONGO_URI and/or JWT_SECRET");
}
export { PORT, MONGO_URI, JWT_SECRET, NODE_ENV, CLIENT_URL };
//# sourceMappingURL=env.js.map