import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface Kpis {
  activeProjects: number;
  completedThisWeek: number;
  overdueProjects: number;
  teamHeadcount: number;
  attendanceRateToday: number;
  avgProductivityScore: number;
}

export interface ProductivityTrendPoint {
  date: string;
  avgProductivity: number;
  tasksCompleted: number;
}

export interface TeamComparisonRow {
  userId: string;
  name: string;
  department: string | null;
  avgScore: number;
  tasksCompleted: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface WorkloadRow {
  userId: string;
  name: string;
  activeProjects: number;
  estimatedHours: number;
}

export interface HeatmapData {
  weekLabels: string[];
  rows: { day: string; values: (number | null)[] }[];
}

export interface AttendanceTrendPoint {
  date: string;
  present: number;
  late: number;
  absent: number;
  leave: number;
  remote: number;
}

export interface AiInsight {
  id: string;
  tone: "positive" | "warning" | "neutral";
  text: string;
}

export interface ProjectOverview {
  byStatus: StatusCount[];
  byPriority: { priority: string; count: number }[];
  upcoming: { id: string; title: string; dueDate: string | null; status: string; priority: string; client: string | null }[];
}

export interface EmployeePerformanceRow {
  id: string;
  name: string;
  department: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  avgProductivity: number;
  tasksCompleted: number;
  attendanceRate: number;
  activeProjects: number;
}

export interface EmployeePerformanceQuery {
  q?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

const dashboardKey = (path: string, params?: object) => ["dashboard", path, params ?? {}];

export function useKpis() {
  return useQuery({
    queryKey: dashboardKey("kpis"),
    queryFn: async () => (await apiClient.get<Kpis>("/dashboard/kpis")).data,
  });
}

export function useProductivityTrend(range = "30d") {
  return useQuery({
    queryKey: dashboardKey("productivity-trend", { range }),
    queryFn: async () => (await apiClient.get<ProductivityTrendPoint[]>("/dashboard/productivity-trend", { params: { range } })).data,
  });
}

export function useTeamComparison() {
  return useQuery({
    queryKey: dashboardKey("team-comparison"),
    queryFn: async () => (await apiClient.get<TeamComparisonRow[]>("/dashboard/team-comparison")).data,
  });
}

export function useTaskStatusDistribution() {
  return useQuery({
    queryKey: dashboardKey("task-status-distribution"),
    queryFn: async () => (await apiClient.get<StatusCount[]>("/dashboard/task-status-distribution")).data,
  });
}

export function useWorkloadDistribution() {
  return useQuery({
    queryKey: dashboardKey("workload-distribution"),
    queryFn: async () => (await apiClient.get<WorkloadRow[]>("/dashboard/workload-distribution")).data,
  });
}

export function useProductivityHeatmap(weeks = 8) {
  return useQuery({
    queryKey: dashboardKey("productivity-heatmap", { weeks }),
    queryFn: async () => (await apiClient.get<HeatmapData>("/dashboard/productivity-heatmap", { params: { weeks } })).data,
  });
}

export function useAttendanceTrend(range = "30d") {
  return useQuery({
    queryKey: dashboardKey("attendance-trend", { range }),
    queryFn: async () => (await apiClient.get<AttendanceTrendPoint[]>("/dashboard/attendance-trend", { params: { range } })).data,
  });
}

export function useAiInsights() {
  return useQuery({
    queryKey: dashboardKey("ai-insights"),
    queryFn: async () => (await apiClient.get<AiInsight[]>("/dashboard/ai-insights")).data,
  });
}

export function useProjectOverview() {
  return useQuery({
    queryKey: dashboardKey("project-overview"),
    queryFn: async () => (await apiClient.get<ProjectOverview>("/dashboard/project-overview")).data,
  });
}

export function useEmployeePerformance(query: EmployeePerformanceQuery) {
  return useQuery({
    queryKey: dashboardKey("employee-performance", query),
    queryFn: async () => (await apiClient.get("/dashboard/employee-performance", { params: query })).data as {
      items: EmployeePerformanceRow[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    },
    placeholderData: (prev) => prev,
  });
}
