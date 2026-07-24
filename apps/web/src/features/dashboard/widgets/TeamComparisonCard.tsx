import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useTeamComparison } from "../api";
import { ChartTooltip } from "../ChartTooltip";

export function TeamComparisonCard() {
  const { data, isLoading } = useTeamComparison();
  const colors = useChartColors();

  const top = (data ?? []).slice(0, 8).map((row) => ({ ...row, shortName: row.name.split(" ")[0] + " " + (row.name.split(" ")[1]?.[0] ?? "") + "." }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Team Performance Comparison</CardTitle>
          <CardDescription>Average productivity score, last 30 days</CardDescription>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid stroke={colors.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: colors.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="shortName"
                width={64}
                tick={{ fill: colors.text, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: colors.grid, opacity: 0.4 }}
                content={
                  <ChartTooltip
                    formatter={(value, name) => [name === "avgScore" ? `${value}` : String(value), name === "avgScore" ? "Avg. score" : name]}
                  />
                }
              />
              <Bar dataKey="avgScore" fill={colors.brand} radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
