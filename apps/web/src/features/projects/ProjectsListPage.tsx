import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { AvatarStack } from "@/components/ui/Avatar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectsFilters } from "./ProjectsFilters";
import { useDeleteProject, useProjects, type ProjectFilters } from "./api";
import { useUsers } from "@/lib/queries/users";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate, formatHours, isOverdue } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/api";

const DEFAULT_FILTERS: ProjectFilters = {
  q: "",
  status: "",
  priority: "",
  assigneeId: "",
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortDir: "desc",
};

interface ProjectsListPageProps {
  scope?: "all" | "mine";
}

export function ProjectsListPage({ scope = "all" }: ProjectsListPageProps) {
  const location = useLocation();
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_FILTERS);
  const debouncedQ = useDebouncedValue(filters.q ?? "", 300);
  const { data, isLoading } = useProjects({ ...filters, q: debouncedQ }, scope);
  const { data: users } = useUsers();
  const deleteProject = useDeleteProject();

  function patchFilters(patch: Partial<ProjectFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleSortChange(key: string) {
    patchFilters({
      sortBy: key,
      sortDir: filters.sortBy === key && filters.sortDir === "asc" ? "desc" : "asc",
    });
  }

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project",
      sortable: true,
      render: (p) => (
        <div className="max-w-xs">
          <p className="truncate font-medium text-text-primary">{p.title}</p>
          <p className="truncate text-xs text-text-tertiary">{p.client?.name ?? "Internal"}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", sortable: true, render: (p) => <StatusBadge status={p.status} /> },
    { key: "priority", header: "Priority", sortable: true, render: (p) => <PriorityBadge priority={p.priority} /> },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (p) => (
        <span className={cn(isOverdue(p.dueDate, p.status) ? "font-medium text-danger-600 dark:text-danger-500" : "text-text-secondary")}>
          {formatDate(p.dueDate)}
        </span>
      ),
    },
    {
      key: "assignees",
      header: "Assignees",
      render: (p) => (p.assignees.length > 0 ? <AvatarStack people={p.assignees} /> : <span className="text-text-tertiary">—</span>),
    },
    {
      key: "tags",
      header: "Tags",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.tags.slice(0, 2).map((t) => (
            <Badge key={t} tone="slate">
              {t}
            </Badge>
          ))}
          {p.tags.length > 2 && <Badge tone="slate">+{p.tags.length - 2}</Badge>}
        </div>
      ),
    },
    {
      key: "estimatedHours",
      header: "Est. Hours",
      render: (p) => <span className="text-text-secondary">{formatHours(p.estimatedHours)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
            try {
              await deleteProject.mutateAsync(p.id);
              toast.success("Project deleted");
            } catch {
              toast.error("Failed to delete project");
            }
          }}
          className="rounded-md p-1.5 text-text-tertiary hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10"
          aria-label={`Delete ${p.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <PageHeader
        title={scope === "mine" ? "My Projects" : "Projects"}
        description={scope === "mine" ? "Projects assigned to you" : "All projects across your organization"}
        actions={
          <Link to="/projects/new" state={{ backgroundLocation: location }}>
            <Button>
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          </Link>
        }
      />

      <Card>
        <ProjectsFilters
          filters={filters}
          onChange={patchFilters}
          hideAssignee={scope === "mine"}
          assigneeOptions={users?.map((u) => ({ id: u.id, name: u.name }))}
        />

        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          getRowId={(p) => p.id}
          isLoading={isLoading}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          onSortChange={handleSortChange}
          emptyState={
            <EmptyState
              icon={FolderKanban}
              title="No projects found"
              description="Try adjusting your filters, or create a new project to get started."
              action={
                <Link to="/projects/new" state={{ backgroundLocation: location }}>
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> Create Project
                  </Button>
                </Link>
              }
            />
          }
        />

        {data && data.total > 0 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={(page) => patchFilters({ page })}
          />
        )}
      </Card>
    </div>
  );
}
