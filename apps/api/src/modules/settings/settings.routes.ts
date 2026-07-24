import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import { updatePlanSchema } from "./settings.schema";
import * as settingsService from "./settings.service";

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

settingsRouter.get("/plan", requireRole("super_admin"), async (_req, res, next) => {
  try {
    res.json(await settingsService.getPlan());
  } catch (err) {
    next(err);
  }
});

settingsRouter.patch("/plan", requireRole("super_admin"), async (req, res, next) => {
  try {
    const input = updatePlanSchema.parse(req.body);
    res.json(await settingsService.updatePlan(input));
  } catch (err) {
    next(err);
  }
});
