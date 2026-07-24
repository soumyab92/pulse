import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChartColors } from "@/lib/chartTheme";
import { useAttendanceTrend } from "../api";
import { ChartTooltip } from "../ChartTooltip";

const SERIES: { key: "present" | "remote" | "late" | "leave" | "absent"; label: string }[] = [
  { key: "present", label: "Present" },
  { key: "remote", label: "Remote" },
  { key: "late", label: "Late" },
  { key: "leave", label: "Leave" },
  { key: "absent", label: "Absent" },
];

const safeFormatDate = (dateStr: string, fmt = "MMM d") => {
  try {
    if (!dateStr) return "";
    const parsed = parseISO(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return format(parsed, fmt);
  } catch {
    return dateStr || "";
  }
};

export function AttendanceTrendCard() {
  const { data, isLoading } = useAttendanceTrend("30d");
  const colors = useChartColors();

  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Attendance Trend</CardTitle>
          <CardDescription>Daily attendance breakdown, last 30 days</CardDescription>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={safeData} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => safeFormatDate(d, "MMM d")}
                tick={{ fill: colors.text, fontSize: 11 }}
                axisLine={{ stroke: colors.grid }}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis allowDecimals={false} tick={{ fill: colors.text, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTooltip labelFormatter={(l) => safeFormatDate(l, "MMM d, yyyy")} />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
              />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stackId="attendance"
                  stroke={colors.attendanceStatus[s.key]}
                  fill={colors.attendanceStatus[s.key]}
                  fillOpacity={0.65}
                  strokeWidth={1.5}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
