import { Request } from "express";

import { AuthPayload } from "./auth-payload.interface";

export interface AuthRequest extends Request {
  user: AuthPayload;
}
