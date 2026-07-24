import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: "This account has been deactivated" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action" });
    }

    next();
  };
}
