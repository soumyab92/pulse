import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { prisma } from "../../lib/prisma";

function parseRangeDays(range: string | undefined, fallback = 30) {
  const match = /^(\d+)d$/.exec(range ?? "");
  return match ? Number(match[1]) : fallback;
}

export async function getKpis() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [
    activeProjects,
    completedThisWeek,
    overdueProjects,
    teamHeadcount,
    todayAttendance,
    recentMetrics,
  ] = await Promise.all([
    prisma.project.count({ where: { status: { in: ["in_progress", "in_review"] } } }),
    prisma.project.count({ where: { status: "completed", updatedAt: { gte: weekStart } } }),
    prisma.project.count({ where: { dueDate: { lt: now }, status: { notIn: ["completed"] } } }),
    prisma.user.count(),
    prisma.attendanceRecord.findMany({ where: { date: { gte: todayStart, lte: todayEnd } } }),
    prisma.productivityMetric.findMany({ where: { date: { gte: subDays(now, 7) } } }),
  ]);

  const presentToday = todayAttendance.filter((a) => a.status === "present" || a.status === "remote").length;
  const attendanceRateToday = teamHeadcount > 0 ? Math.round((presentToday / teamHeadcount) * 100) : 0;

  const avgProductivityScore = recentMetrics.length
    ? Math.round(recentMetrics.reduce((sum, m) => sum + m.productivityScore, 0) / recentMetrics.length)
    : 0;

  return {
    activeProjects,
    completedThisWeek,
    overdueProjects,
    teamHeadcount,
    attendanceRateToday,
    avgProductivityScore,
  };
}

export async function getProductivityTrend(range?: string) {
  const days = parseRangeDays(range);
  const since = startOfDay(subDays(new Date(), days - 1));
  const metrics = await prisma.productivityMetric.findMany({ where: { date: { gte: since } } });

  const byDate = new Map<string, { score: number; tasks: number; count: number }>();
  for (const m of metrics) {
    const key = format(m.date, "yyyy-MM-dd");
    const entry = byDate.get(key) ?? { score: 0, tasks: 0, count: 0 };
    entry.score += m.productivityScore;
    entry.tasks += m.tasksCompleted;
    entry.count += 1;
    byDate.set(key, entry);
  }

  return eachDayOfInterval({ start: since, end: new Date() })
    .map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const entry = byDate.get(key);
      if (!entry) return null;
      return {
        date: key,
        avgProductivity: Math.round(entry.score / entry.count),
        tasksCompleted: entry.tasks,
      };
    })
    .filter((point): point is { date: string; avgProductivity: number; tasksCompleted: number } => point !== null);
}

export async function getTeamComparison() {
  const since = subDays(new Date(), 30);
  const users = await prisma.user.findMany({
    select: { id: true, name: true, department: true },
  });
  const metrics = await prisma.productivityMetric.findMany({ where: { date: { gte: since } } });

  return users
    .map((user) => {
      const userMetrics = metrics.filter((m) => m.userId === user.id);
      const avgScore = userMetrics.length
        ? Math.round(userMetrics.reduce((sum, m) => sum + m.productivityScore, 0) / userMetrics.length)
        : 0;
      const tasksCompleted = userMetrics.reduce((sum, m) => sum + m.tasksCompleted, 0);
      return { userId: user.id, name: user.name, department: user.department, avgScore, tasksCompleted };
    })
    .sort((a, b) => b.avgScore - a.avgScore);
}

export async function getTaskStatusDistribution() {
  const grouped = await prisma.project.groupBy({ by: ["status"], _count: { _all: true } });
  return grouped.map((g) => ({ status: g.status, count: g._count._all }));
}

export async function getWorkloadDistribution() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const assignments = await prisma.projectAssignment.findMany({
    include: { project: { select: { status: true, estimatedHours: true } } },
  });

  return users
    .map((user) => {
      const active = assignments.filter(
        (a) => a.userId === user.id && a.project.status !== "completed",
      );
      const estimatedHours = active.reduce((sum, a) => sum + (a.project.estimatedHours ?? 0), 0);
      return { userId: user.id, name: user.name, activeProjects: active.length, estimatedHours: Math.round(estimatedHours) };
    })
    .sort((a, b) => b.activeProjects - a.activeProjects);
}

export async function getProductivityHeatmap(weeksParam?: string) {
  const weeks = Math.min(12, Math.max(1, Number(weeksParam) || 8));
  const now = new Date();
  const start = startOfWeek(subDays(now, weeks * 7 - 1), { weekStartsOn: 1 });
  const metrics = await prisma.productivityMetric.findMany({ where: { date: { gte: start } } });

  const byDate = new Map<string, { total: number; count: number }>();
  for (const m of metrics) {
    const key = format(m.date, "yyyy-MM-dd");
    const entry = byDate.get(key) ?? { total: 0, count: 0 };
    entry.total += m.focusScore;
    entry.count += 1;
    byDate.set(key, entry);
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekStarts = Array.from({ length: weeks }, (_, i) => startOfWeek(subDays(now, (weeks - 1 - i) * 7), { weekStartsOn: 1 }));

  const rows = dayLabels.map((label, dayIndex) => ({
    day: label,
    values: weekStarts.map((weekStart) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + dayIndex);
      const key = format(date, "yyyy-MM-dd");
      const entry = byDate.get(key);
      return entry ? Math.round(entry.total / entry.count) : null;
    }),
  }));

  return {
    weekLabels: weekStarts.map((d) => format(d, "MMM d")),
    rows,
  };
}

export async function getAttendanceTrend(range?: string) {
  const days = parseRangeDays(range);
  const since = startOfDay(subDays(new Date(), days - 1));
  const records = await prisma.attendanceRecord.findMany({ where: { date: { gte: since } } });

  const byDate = new Map<string, Record<string, number>>();
  for (const r of records) {
    const key = format(r.date, "yyyy-MM-dd");
    const entry = byDate.get(key) ?? { present: 0, late: 0, absent: 0, leave: 0, remote: 0 };
    entry[r.status] = (entry[r.status] ?? 0) + 1;
    byDate.set(key, entry);
  }

  return eachDayOfInterval({ start: since, end: new Date() })
    .map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const entry = byDate.get(key);
      if (!entry) return null;
      return { date: key, ...entry };
    })
    .filter((point): point is { date: string; present: number; late: number; absent: number; leave: number; remote: number } => point !== null);
}

export async function getActivityFeed(limit = 20) {
  const events = await prisma.activityEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });
  return events;
}

export async function getProjectOverview() {
  const [byStatus, byPriority, upcoming] = await Promise.all([
    prisma.project.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.project.groupBy({ by: ["priority"], _count: { _all: true } }),
    prisma.project.findMany({
      where: { dueDate: { gte: new Date() }, status: { notIn: ["completed"] } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  return {
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
    byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count._all })),
    upcoming: upcoming.map((p) => ({
      id: p.id,
      title: p.title,
      dueDate: p.dueDate,
      status: p.status,
      priority: p.priority,
      client: p.client?.name ?? null,
    })),
  };
}

export async function getAiInsights() {
  const now = new Date();
  const thisWeekStart = subDays(now, 7);
  const lastWeekStart = subDays(now, 14);

  const [thisWeek, lastWeek, overdue, users] = await Promise.all([
    prisma.productivityMetric.findMany({ where: { date: { gte: thisWeekStart } } }),
    prisma.productivityMetric.findMany({ where: { date: { gte: lastWeekStart, lt: thisWeekStart } } }),
    prisma.project.count({ where: { dueDate: { lt: now }, status: { notIn: ["completed"] } } }),
    prisma.user.findMany({ select: { id: true, name: true, department: true } }),
  ]);

  const insights: { id: string; tone: "positive" | "warning" | "neutral"; text: string }[] = [];

  const avg = (rows: typeof thisWeek) =>
    rows.length ? rows.reduce((s, r) => s + r.productivityScore, 0) / rows.length : 0;

  const thisAvg = avg(thisWeek);
  const lastAvg = avg(lastWeek);
  if (lastAvg > 0) {
    const delta = Math.round(((thisAvg - lastAvg) / lastAvg) * 100);
    if (Math.abs(delta) >= 3) {
      insights.push({
        id: "team-trend",
        tone: delta > 0 ? "positive" : "warning",
        text: `Team-wide productivity is ${delta > 0 ? "up" : "down"} ${Math.abs(delta)}% versus last week (${Math.round(thisAvg)} vs ${Math.round(lastAvg)} avg score).`,
      });
    }
  }

  const byDept = new Map<string, { this: number[]; last: number[] }>();
  for (const u of users) {
    const dept = u.department ?? "Unassigned";
    if (!byDept.has(dept)) byDept.set(dept, { this: [], last: [] });
    byDept.get(dept)!.this.push(...thisWeek.filter((m) => m.userId === u.id).map((m) => m.productivityScore));
    byDept.get(dept)!.last.push(...lastWeek.filter((m) => m.userId === u.id).map((m) => m.productivityScore));
  }

  let biggestMoverDept = "";
  let biggestMoverDelta = 0;
  for (const [dept, data] of byDept) {
    const thisD = data.this.length ? data.this.reduce((s, v) => s + v, 0) / data.this.length : 0;
    const lastD = data.last.length ? data.last.reduce((s, v) => s + v, 0) / data.last.length : 0;
    if (lastD > 0) {
      const delta = Math.round(((thisD - lastD) / lastD) * 100);
      if (Math.abs(delta) > Math.abs(biggestMoverDelta)) {
        biggestMoverDelta = delta;
        biggestMoverDept = dept;
      }
    }
  }
  if (biggestMoverDept && Math.abs(biggestMoverDelta) >= 5) {
    insights.push({
      id: "dept-mover",
      tone: biggestMoverDelta > 0 ? "positive" : "warning",
      text: `${biggestMoverDept} saw the largest productivity shift this week: ${biggestMoverDelta > 0 ? "+" : ""}${biggestMoverDelta}%.`,
    });
  }

  if (overdue > 0) {
    insights.push({
      id: "overdue",
      tone: "warning",
      text: `${overdue} project${overdue === 1 ? " is" : "s are"} past due date and not yet completed — consider reprioritizing.`,
    });
  } else {
    insights.push({ id: "overdue", tone: "positive", text: "No overdue projects — the team is on track with deadlines." });
  }

  const lowFocus = thisWeek.filter((m) => m.focusScore < 50);
  if (lowFocus.length > thisWeek.length * 0.2 && thisWeek.length > 0) {
    insights.push({
      id: "focus",
      tone: "warning",
      text: `${Math.round((lowFocus.length / thisWeek.length) * 100)}% of logged days this week show focus scores below 50 — may be worth checking in with the team.`,
    });
  }

  if (insights.length === 0) {
    insights.push({ id: "steady", tone: "neutral", text: "Team performance is steady this week with no major shifts detected." });
  }

  return insights;
}

interface EmployeePerformanceQuery {
  q?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export async function getEmployeePerformance(query: EmployeePerformanceQuery) {
  const since = subDays(new Date(), 30);
  const [users, metrics, attendance, assignments] = await Promise.all([
    prisma.user.findMany(),
    prisma.productivityMetric.findMany({ where: { date: { gte: since } } }),
    prisma.attendanceRecord.findMany({ where: { date: { gte: since } } }),
    prisma.projectAssignment.findMany({ include: { project: { select: { status: true } } } }),
  ]);

  let rows = users.map((user) => {
    const userMetrics = metrics.filter((m) => m.userId === user.id);
    const userAttendance = attendance.filter((a) => a.userId === user.id);
    const userAssignments = assignments.filter((a) => a.userId === user.id);

    const avgProductivity = userMetrics.length
      ? Math.round(userMetrics.reduce((s, m) => s + m.productivityScore, 0) / userMetrics.length)
      : 0;
    const tasksCompleted = userMetrics.reduce((s, m) => s + m.tasksCompleted, 0);
    const presentDays = userAttendance.filter((a) => a.status === "present" || a.status === "remote").length;
    const attendanceRate = userAttendance.length ? Math.round((presentDays / userAttendance.length) * 100) : 0;
    const activeProjects = userAssignments.filter((a) => a.project.status !== "completed").length;

    return {
      id: user.id,
      name: user.name,
      department: user.department,
      jobTitle: user.jobTitle,
      avatarUrl: user.avatarUrl,
      avgProductivity,
      tasksCompleted,
      attendanceRate,
      activeProjects,
    };
  });

  if (query.q) {
    const q = query.q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(q) || (r.department ?? "").toLowerCase().includes(q),
    );
  }

  rows.sort((a, b) => {
    const dir = query.sortDir === "asc" ? 1 : -1;
    const key = query.sortBy as keyof typeof a;
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
  });

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  const items = rows.slice(start, start + query.pageSize);

  return { items, total, page: query.page, pageSize: query.pageSize, totalPages: Math.max(1, Math.ceil(total / query.pageSize)) };
}
