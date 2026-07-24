import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  notifyEmail: z.boolean().optional(),
  notifyInApp: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
