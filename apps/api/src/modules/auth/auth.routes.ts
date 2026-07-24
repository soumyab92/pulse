import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { loginHandler, logoutHandler, meHandler } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", requireAuth, meHandler);
