import { z } from "zod";
import { PLAN_TIERS } from "../../types/dto";

export const updatePlanSchema = z.object({
  plan: z.enum(PLAN_TIERS),
});

export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
