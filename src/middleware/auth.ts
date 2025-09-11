import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthedRequest extends Request {
  userId?: number;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as { id: number };
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
