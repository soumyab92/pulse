import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useWorkloadDistribution } from "../api";
import { ChartTooltip } from "../ChartTooltip";

export function WorkloadDistributionCard() {
  const { data, isLoading } = useWorkloadDistribution();
  const colors = useChartColors();

  const top = (data ?? [])
    .slice()
    .sort((a, b) => b.activeProjects - a.activeProjects)
    .slice(0, 8)
    .map((row) => ({ ...row, shortName: row.name.split(" ")[0] }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Workload Distribution</CardTitle>
          <CardDescription>Active projects per team member</CardDescription>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top} margin={{ left: -16, right: 8 }}>
              <CartesianGrid stroke={colors.grid} vertical={false} />
              <XAxis dataKey="shortName" tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: colors.text, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                cursor={{ fill: colors.grid, opacity: 0.4 }}
                content={
                  <ChartTooltip
                    formatter={(value, name) => [`${value}`, name === "activeProjects" ? "Active projects" : "Est. hours"]}
                  />
                }
              />
              <Bar dataKey="activeProjects" fill={colors.brand} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
