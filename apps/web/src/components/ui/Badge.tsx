import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "slate" | "blue" | "green" | "amber" | "red";

const toneClasses: Record<Tone, string> = {
  slate: "bg-bg text-text-secondary border-border",
  blue: "bg-brand-50 text-brand-700 border-brand-100 dark:bg-brand-900/20 dark:text-brand-300 dark:border-brand-800/40",
  green:
    "bg-success-50 text-success-700 border-success-100 dark:bg-success-500/10 dark:text-success-500 dark:border-success-500/20",
  amber:
    "bg-warning-50 text-warning-700 border-warning-100 dark:bg-warning-500/10 dark:text-warning-500 dark:border-warning-500/20",
  red: "bg-danger-50 text-danger-700 border-danger-100 dark:bg-danger-500/10 dark:text-danger-500 dark:border-danger-500/20",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "slate", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
};

const STATUS_TONE: Record<string, Tone> = {
  not_started: "slate",
  in_progress: "blue",
  in_review: "amber",
  completed: "green",
  blocked: "red",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "slate"}>{STATUS_LABEL[status] ?? status}</Badge>;
}

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const PRIORITY_TONE: Record<string, Tone> = {
  low: "slate",
  medium: "blue",
  high: "amber",
  urgent: "red",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return <Badge tone={PRIORITY_TONE[priority] ?? "slate"}>{PRIORITY_LABEL[priority] ?? priority}</Badge>;
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  member: "Member",
};

const ROLE_TONE: Record<string, Tone> = {
  super_admin: "red",
  admin: "amber",
  manager: "blue",
  member: "slate",
};

export function RoleBadge({ role }: { role: string }) {
  return <Badge tone={ROLE_TONE[role] ?? "slate"}>{ROLE_LABEL[role] ?? role}</Badge>;
}
