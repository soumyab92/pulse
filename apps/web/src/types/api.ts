// Keep enum values in sync with apps/api/src/types/dto.ts

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

export type UserRole = "super_admin" | "admin" | "manager" | "member";
export const ASSIGNABLE_USER_ROLES = ["admin", "manager", "member"] as const;
export type AssignableUserRole = (typeof ASSIGNABLE_USER_ROLES)[number];

export type Plan = "free" | "pro" | "enterprise";
export const PLAN_TIERS: Plan[] = ["free", "pro", "enterprise"];

export interface OrgSettings {
  id: string;
  plan: Plan;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  jobTitle: string | null;
  department: string | null;
  address: string | null;
  notifyEmail: boolean;
  notifyInApp: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  department: string | null;
  jobTitle: string | null;
  address: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logoColor: string | null;
  status: "active" | "inactive";
  createdAt: string;
  _count?: { projects: number };
}

export interface Attachment {
  id: string;
  projectId: string;
  fileName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  priority: ProjectPriority;
  status: ProjectStatus;
  dueDate: string | null;
  estimatedHours: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client: Client | null;
  assignees: { id: string; name: string; avatarUrl: string | null }[];
  tags: string[];
  attachments: Attachment[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Credential {
  id: string;
  toolName: string;
  username: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  maskedSecret: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null } | null;
}
