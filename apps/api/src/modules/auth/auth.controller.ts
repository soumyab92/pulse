import { Request, Response, NextFunction } from "express";
import { loginSchema } from "./auth.schema";
import * as authService from "./auth.service";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function logoutHandler(_req: Request, res: Response) {
  res.status(204).end();
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getCurrentUser(req.user!.sub);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
