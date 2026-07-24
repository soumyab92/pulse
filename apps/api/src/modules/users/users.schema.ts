import { z } from "zod";
import { ASSIGNABLE_USER_ROLES } from "../../types/dto";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Temporary password must be at least 8 characters"),
  role: z.enum(ASSIGNABLE_USER_ROLES).default("member"),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(ASSIGNABLE_USER_ROLES).optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
