import { prisma } from "../../lib/prisma";
import { decrypt, encrypt } from "../../lib/crypto";
import { ApiError } from "../../middleware/errorHandler";
import { CreateCredentialInput, UpdateCredentialInput } from "./credentials.schema";

function shape(cred: { id: string; toolName: string; username: string; notes: string | null; createdAt: Date; updatedAt: Date }) {
  return {
    id: cred.id,
    toolName: cred.toolName,
    username: cred.username,
    notes: cred.notes,
    createdAt: cred.createdAt,
    updatedAt: cred.updatedAt,
    maskedSecret: "••••••••••••",
  };
}

export async function listCredentials() {
  const creds = await prisma.credential.findMany({ orderBy: { toolName: "asc" } });
  return creds.map(shape);
}

export async function createCredential(input: CreateCredentialInput) {
  const cred = await prisma.credential.create({
    data: {
      toolName: input.toolName,
      username: input.username,
      notes: input.notes,
      secretEnc: encrypt(input.secret),
    },
  });
  return shape(cred);
}

export async function updateCredential(id: string, input: UpdateCredentialInput) {
  const existing = await prisma.credential.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Credential not found");

  const cred = await prisma.credential.update({
    where: { id },
    data: {
      toolName: input.toolName,
      username: input.username,
      notes: input.notes,
      secretEnc: input.secret ? encrypt(input.secret) : undefined,
    },
  });
  return shape(cred);
}

export async function deleteCredential(id: string) {
  const existing = await prisma.credential.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Credential not found");
  await prisma.credential.delete({ where: { id } });
}

export async function revealCredential(id: string) {
  const cred = await prisma.credential.findUnique({ where: { id } });
  if (!cred) throw new ApiError(404, "Credential not found");
  return { secret: decrypt(cred.secretEnc) };
}
