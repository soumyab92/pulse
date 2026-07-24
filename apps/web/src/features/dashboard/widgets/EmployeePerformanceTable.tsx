import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useEmployeePerformance, type EmployeePerformanceRow } from "../api";

export function EmployeePerformanceTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("avgProductivity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const debouncedQ = useDebouncedValue(q, 300);

  const { data, isLoading } = useEmployeePerformance({ q: debouncedQ, page, pageSize: 8, sortBy, sortDir });

  function handleSortChange(key: string) {
    if (key === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  const columns: Column<EmployeePerformanceRow>[] = [
    {
      key: "name",
      header: "Employee",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={r.name} src={r.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-text-primary">{r.name}</p>
            <p className="truncate text-xs text-text-tertiary">{r.jobTitle ?? r.department}</p>
          </div>
        </div>
      ),
    },
    { key: "department", header: "Department", sortable: true, render: (r) => <span className="text-text-secondary">{r.department ?? "—"}</span> },
    {
      key: "avgProductivity",
      header: "Avg. Productivity",
      sortable: true,
      render: (r) => <span className="font-medium text-text-primary">{r.avgProductivity}</span>,
    },
    { key: "tasksCompleted", header: "Tasks Completed", sortable: true, render: (r) => <span className="text-text-secondary">{r.tasksCompleted}</span> },
    { key: "attendanceRate", header: "Attendance", sortable: true, render: (r) => <span className="text-text-secondary">{r.attendanceRate}%</span> },
    { key: "activeProjects", header: "Active Projects", sortable: true, render: (r) => <span className="text-text-secondary">{r.activeProjects}</span> },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Employee Performance</CardTitle>
          <CardDescription>Search, sort, and paginate across the full team</CardDescription>
        </div>
      </CardHeader>
      <div className="border-b border-border p-4">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search employees…"
            className="pl-8"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        emptyState={<EmptyState icon={Users} title="No employees match your search" />}
      />
      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </Card>
  );
}
