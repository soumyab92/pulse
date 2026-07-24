import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import { ApiError } from "../../middleware/errorHandler";
import { createUserSchema, updateUserSchema } from "./users.schema";
import * as usersService from "./users.service";

export const usersRouter = Router();

usersRouter.use(requireAuth);

// Admin (super_admin only) routes — registered before "/:id" so "/admin" isn't
// swallowed by the param route.
usersRouter.get("/admin", requireRole("super_admin"), async (_req, res, next) => {
  try {
    res.json(await usersService.listUsersForAdmin());
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/admin", requireRole("super_admin"), async (req, res, next) => {
  try {
    const input = createUserSchema.parse(req.body);
    res.status(201).json(await usersService.createUser(input));
  } catch (err) {
    next(err);
  }
});

usersRouter.patch("/admin/:id", requireRole("super_admin"), async (req, res, next) => {
  try {
    const input = updateUserSchema.parse(req.body);
    res.json(await usersService.updateUser(req.params.id, input));
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/admin/:id", requireRole("super_admin"), async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// General routes — any authenticated user (backs assignee pickers, etc.)
usersRouter.get("/", async (_req, res, next) => {
  try {
    res.json(await usersService.listUsers());
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
});
