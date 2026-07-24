// Keep enum values in sync with apps/web/src/types/api.ts

export const PROJECT_STATUSES = [
  "not_started",
  "in_progress",
  "in_review",
  "completed",
  "blocked",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export const ATTENDANCE_STATUSES = ["present", "late", "absent", "leave", "remote"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const USER_ROLES = ["super_admin", "admin", "manager", "member"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ASSIGNABLE_USER_ROLES = ["admin", "manager", "member"] as const;
export type AssignableUserRole = (typeof ASSIGNABLE_USER_ROLES)[number];

export const PLAN_TIERS = ["free", "pro", "enterprise"] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];
