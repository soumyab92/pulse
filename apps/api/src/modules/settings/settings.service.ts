import { prisma } from "../../lib/prisma";
import { UpdatePlanInput } from "./settings.schema";

async function getOrCreateSettings() {
  const existing = await prisma.orgSettings.findFirst();
  if (existing) return existing;
  return prisma.orgSettings.create({ data: { plan: "free" } });
}

export async function getPlan() {
  return getOrCreateSettings();
}

export async function updatePlan(input: UpdatePlanInput) {
  const settings = await getOrCreateSettings();
  return prisma.orgSettings.update({ where: { id: settings.id }, data: { plan: input.plan } });
}
