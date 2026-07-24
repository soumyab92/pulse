import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useProjectOverview } from "../api";

const STATUS_ORDER = ["completed", "in_progress", "in_review", "not_started", "blocked"] as const;
const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
};

export function TaskProgressCard() {
  const { data, isLoading } = useProjectOverview();
  const colors = useChartColors();

  const byStatus = Array.isArray(data?.byStatus) ? data.byStatus : [];
  const total = byStatus.reduce((sum, s) => sum + (s?.count ?? 0), 0);
  const completed = byStatus.find((s) => s.status === "completed")?.count ?? 0;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

  const countFor = (status: string) => byStatus.find((s) => s.status === status)?.count ?? 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Overall completion across all projects</CardDescription>
        </div>
        <p className="text-lg font-semibold text-text-primary">{percentComplete}%</p>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-bg">
              {STATUS_ORDER.map((status) => {
                const count = countFor(status);
                const pct = total > 0 ? (count / total) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={status}
                    style={{ width: `${pct}%`, backgroundColor: colors.projectStatus[status] }}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                  />
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colors.projectStatus[status] }} />
                  <span className="text-text-tertiary">{STATUS_LABEL[status]}</span>
                  <span className="ml-auto font-medium text-text-primary">{countFor(status)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
