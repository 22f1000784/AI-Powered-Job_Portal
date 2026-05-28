import { Request } from "express";
import { UserRole } from "../utils/enum";
import { Express } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
  file?: Express.Multer.File; // ✅ correct place
}
