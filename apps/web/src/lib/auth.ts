import type { User } from "@/types/api";

export function isSuperAdmin(user: User | null | undefined): boolean {
  return user?.role === "super_admin";
}
