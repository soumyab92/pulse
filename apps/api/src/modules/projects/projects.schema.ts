import { z } from "zod";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "../../types/dto";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  clientId: z.string().optional().nullable(),
  priority: z.enum(PROJECT_PRIORITIES).default("medium"),
  status: z.enum(PROJECT_STATUSES).default("not_started"),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedHours: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().optional(),
  assigneeIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  priority: z.enum(PROJECT_PRIORITIES).optional(),
  clientId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["title", "dueDate", "priority", "status", "createdAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
