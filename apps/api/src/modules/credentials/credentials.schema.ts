import { z } from "zod";

export const createCredentialSchema = z.object({
  toolName: z.string().min(1),
  username: z.string().min(1),
  secret: z.string().min(1),
  notes: z.string().optional(),
});

export const updateCredentialSchema = z.object({
  toolName: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  secret: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
