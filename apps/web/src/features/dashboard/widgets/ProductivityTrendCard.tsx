import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useProductivityTrend } from "../api";
import { ChartTooltip } from "../ChartTooltip";

export function ProductivityTrendCard() {
  const { data, isLoading } = useProductivityTrend("30d");
  const colors = useChartColors();

  const safeData = Array.isArray(data) ? data : [];
  const totalTasks = safeData.reduce((sum, d) => sum + (d?.tasksCompleted ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Employee Productivity Trend</CardTitle>
          <CardDescription>Team average productivity score, last 30 days</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary">{totalTasks}</p>
          <p className="text-xs text-text-tertiary">tasks completed</p>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="productivityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.brand} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={colors.brand} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(parseISO(d), "MMM d")}
                tick={{ fill: colors.text, fontSize: 11 }}
                axisLine={{ stroke: colors.grid }}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: colors.text, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(value, name) =>
                      name === "avgProductivity" ? [`${value}`, "Avg. productivity"] : [`${value}`, name]
                    }
                    labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="avgProductivity"
                stroke={colors.brand}
                strokeWidth={2}
                fill="url(#productivityFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
