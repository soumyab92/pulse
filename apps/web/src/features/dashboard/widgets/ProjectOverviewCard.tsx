import { CalendarClock } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriorityBadge } from "@/components/ui/Badge";
import { useProjectOverview } from "../api";
import { formatDate } from "@/lib/formatters";

export function ProjectOverviewCard() {
  const { data, isLoading } = useProjectOverview();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Upcoming deadlines across the portfolio</CardDescription>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data.upcoming.length > 0 ? (
          <ul className="divide-y divide-border">
            {data.upcoming.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{p.title}</p>
                  <p className="truncate text-xs text-text-tertiary">{p.client ?? "Internal"}</p>
                </div>
                <PriorityBadge priority={p.priority} />
                <span className="whitespace-nowrap text-xs text-text-tertiary">{formatDate(p.dueDate)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={CalendarClock} title="No upcoming deadlines" description="All active projects are unscheduled or completed." />
        )}
      </div>
    </Card>
  );
}
