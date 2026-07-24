import { AlertTriangle, CalendarCheck, Gauge, ListChecks, Users, UserCheck } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useKpis } from "../api";

export function KpiRow() {
  const { data, isLoading } = useKpis();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Active Projects" value={data.activeProjects} icon={ListChecks} delay={0.18} />
      <KpiCard label="Completed This Week" value={data.completedThisWeek} icon={CalendarCheck} delay={0.21} />
      <KpiCard
        label="Overdue Projects"
        value={data.overdueProjects}
        icon={AlertTriangle}
        trend={data.overdueProjects > 0 ? { direction: "up", label: "Needs attention", positive: false } : undefined}
        delay={0.24}
      />
      <KpiCard label="Team Headcount" value={data.teamHeadcount} icon={Users} delay={0.27} />
      <KpiCard label="Attendance Today" value={data.attendanceRateToday} suffix="%" icon={UserCheck} delay={0.3} />
      <KpiCard label="Avg. Productivity" value={data.avgProductivityScore} icon={Gauge} delay={0.33} />
    </div>
  );
}
