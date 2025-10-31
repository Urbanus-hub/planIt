import { JwtPayload } from "jsonwebtoken";

export interface AuthUser extends JwtPayload {
  id: string;
  email: string;
  role: "client" | "vendor" | "admin";
}