import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { CreateClientInput, UpdateClientInput } from "./clients.schema";

const ACCENT_COLORS = ["blue", "slate", "emerald", "amber", "rose", "indigo", "teal"];

function colorForName(name: string) {
  const idx = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

export async function listClients(q?: string) {
  return prisma.client.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : undefined,
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { _count: { select: { projects: true } } },
  });
  if (!client) throw new ApiError(404, "Client not found");
  return client;
}

export async function createClient(input: CreateClientInput) {
  return prisma.client.create({
    data: { ...input, email: input.email || null, logoColor: colorForName(input.name) },
  });
}

export async function updateClient(id: string, input: UpdateClientInput) {
  await getClient(id);
  return prisma.client.update({
    where: { id },
    data: { ...input, email: input.email === "" ? null : input.email },
  });
}

export async function deleteClient(id: string) {
  await getClient(id);
  await prisma.client.delete({ where: { id } });
}
