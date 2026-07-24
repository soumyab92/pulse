import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { CreateUserInput, UpdateUserInput } from "./users.schema";

export async function listUsers() {
  return prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      jobTitle: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      jobTitle: true,
      role: true,
    },
  });
}

export async function listUsersForAdmin() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      jobTitle: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      department: input.department,
      jobTitle: input.jobTitle,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      jobTitle: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "super_admin") {
    throw new ApiError(403, "The super admin account cannot be modified here");
  }

  return prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      jobTitle: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "super_admin") {
    throw new ApiError(403, "The super admin account cannot be deleted");
  }

  const createdProjectCount = await prisma.project.count({ where: { createdById: id } });
  if (createdProjectCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete: this user created ${createdProjectCount} project${createdProjectCount > 1 ? "s" : ""}. Deactivate instead.`,
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    throw new ApiError(
      409,
      "Cannot delete: this user still has related records (assignments, attendance, or activity history). Deactivate instead.",
    );
  }
}
