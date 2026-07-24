import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "@/types/api";
import type { ProjectFilters } from "./api";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

interface ProjectsFiltersProps {
  filters: ProjectFilters;
  onChange: (patch: Partial<ProjectFilters>) => void;
  hideAssignee?: boolean;
  assigneeOptions?: { id: string; name: string }[];
}

export function ProjectsFilters({ filters, onChange, hideAssignee, assigneeOptions }: ProjectsFiltersProps) {
  const hasActiveFilters = filters.status || filters.priority || filters.assigneeId || filters.q;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <Input
          value={filters.q ?? ""}
          onChange={(e) => onChange({ q: e.target.value, page: 1 })}
          placeholder="Search projects…"
          className="pl-8"
        />
      </div>

      <Select
        value={filters.status ?? ""}
        onChange={(e) => onChange({ status: e.target.value as ProjectFilters["status"], page: 1 })}
        className="w-auto min-w-[140px]"
      >
        <option value="">All statuses</option>
        {PROJECT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </Select>

      <Select
        value={filters.priority ?? ""}
        onChange={(e) => onChange({ priority: e.target.value as ProjectFilters["priority"], page: 1 })}
        className="w-auto min-w-[140px]"
      >
        <option value="">All priorities</option>
        {PROJECT_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABEL[p]}
          </option>
        ))}
      </Select>

      {!hideAssignee && assigneeOptions && (
        <Select
          value={filters.assigneeId ?? ""}
          onChange={(e) => onChange({ assigneeId: e.target.value, page: 1 })}
          className="w-auto min-w-[160px]"
        >
          <option value="">All assignees</option>
          {assigneeOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      )}

      <Select
        value={`${filters.sortBy}:${filters.sortDir}`}
        onChange={(e) => {
          const [sortBy, sortDir] = e.target.value.split(":");
          onChange({ sortBy, sortDir: sortDir as "asc" | "desc", page: 1 });
        }}
        className="w-auto min-w-[160px]"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="dueDate:asc">Due date (soonest)</option>
        <option value="priority:desc">Priority (high–low)</option>
        <option value="title:asc">Title (A–Z)</option>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ q: "", status: "", priority: "", assigneeId: "", page: 1 })}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
