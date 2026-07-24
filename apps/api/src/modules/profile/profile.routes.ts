import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";
import { toPublicUser } from "../auth/auth.service";
import { updateProfileSchema } from "./profile.schema";

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get("/", async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });
    res.json(toPublicUser(user));
  } catch (err) {
    next(err);
  }
});

profileRouter.patch("/", async (req, res, next) => {
  try {
    const input = updateProfileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: {
        ...input,
        avatarUrl: input.avatarUrl === "" ? null : input.avatarUrl,
      },
    });
    res.json(toPublicUser(user));
  } catch (err) {
    next(err);
  }
});
