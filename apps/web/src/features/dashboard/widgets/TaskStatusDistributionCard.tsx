import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useTaskStatusDistribution } from "../api";
import { ChartTooltip } from "../ChartTooltip";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
  blocked: "Blocked",
};

export function TaskStatusDistributionCard() {
  const { data, isLoading } = useTaskStatusDistribution();
  const colors = useChartColors();

  const total = (data ?? []).reduce((sum, d) => sum + d.count, 0);
  const chartData = (data ?? []).map((d) => ({
    ...d,
    label: STATUS_LABEL[d.status] ?? d.status,
    color: colors.projectStatus[d.status] ?? colors.status.neutral,
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>{total} projects total</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-4 p-5 pt-4 sm:flex-row">
        {isLoading || !data ? (
          <Skeleton className="h-52 w-full" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200} className="max-w-[200px] shrink-0">
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="label" innerRadius={55} outerRadius={80} paddingAngle={2} strokeWidth={2} stroke={colors.tooltipBg}>
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(value, name) => [`${value}`, String(name)]} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2">
              {chartData.map((d) => (
                <div key={d.status} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="flex-1 text-text-secondary">{d.label}</span>
                  <span className="font-medium text-text-primary">{d.count}</span>
                  <span className="w-10 text-right text-xs text-text-tertiary">
                    {total > 0 ? Math.round((d.count / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
