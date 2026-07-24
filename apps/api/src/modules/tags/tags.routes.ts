import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";

export const tagsRouter = Router();

tagsRouter.use(requireAuth);

tagsRouter.get("/", async (_req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    res.json(tags);
  } catch (err) {
    next(err);
  }
});
