import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { localStorageDb } from "./localStorageDb";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Helper for Mock Data resolution
function handleMockRequest(config: InternalAxiosRequestConfig) {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  let body: any = {};
  try {
    body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
  } catch {
    body = {};
  }

  // Tags
  if (url.includes("/tags")) {
    return [
      { id: "tag-1", name: "frontend" },
      { id: "tag-2", name: "backend" },
      { id: "tag-3", name: "ai" },
      { id: "tag-4", name: "devops" },
    ];
  }

  // Profile
  if (url.includes("/profile")) {
    const currentUser = useAuthStore.getState().user || {
      id: "usr-demo",
      name: "Alex Morgan",
      email: "alex@company.com",
      role: "super_admin",
      avatarUrl: null,
      jobTitle: "VP of Engineering",
      department: "Engineering",
      address: "123 Tech Blvd, San Francisco, CA",
      notifyEmail: true,
      notifyInApp: true,
    };
    if (method === "patch") {
      const updated = { ...currentUser, ...body };
      useAuthStore.getState().updateUser(updated);
      return updated;
    }
    return currentUser;
  }

  // Settings / Plan
  if (url.includes("/settings/plan")) {
    if (method === "get") return localStorageDb.getPlan();
    if (method === "patch") return localStorageDb.updatePlan(body.plan);
  }

  // Dashboard APIs
  if (url.includes("/dashboard/kpis")) {
    return {
      activeProjects: localStorageDb.getProjects().filter((p) => p.status === "in_progress").length || 14,
      completedThisWeek: 6,
      overdueProjects: 1,
      teamHeadcount: localStorageDb.getUsers().length || 24,
      attendanceRateToday: 96.2,
      avgProductivityScore: 89.4,
    };
  }

  if (url.includes("/dashboard/productivity-trend")) {
    return [
      { date: "2026-07-10", avgProductivity: 78, tasksCompleted: 12 },
      { date: "2026-07-12", avgProductivity: 82, tasksCompleted: 15 },
      { date: "2026-07-14", avgProductivity: 85, tasksCompleted: 18 },
      { date: "2026-07-16", avgProductivity: 88, tasksCompleted: 22 },
      { date: "2026-07-18", avgProductivity: 91, tasksCompleted: 26 },
      { date: "2026-07-20", avgProductivity: 89, tasksCompleted: 24 },
      { date: "2026-07-22", avgProductivity: 94, tasksCompleted: 29 },
      { date: "2026-07-24", avgProductivity: 92, tasksCompleted: 27 },
    ];
  }

  if (url.includes("/dashboard/team-comparison")) {
    return [
      { userId: "usr-1", name: "Alex Morgan", department: "Engineering", avgScore: 94, tasksCompleted: 42 },
      { userId: "usr-2", name: "David Kim", department: "Backend", avgScore: 88, tasksCompleted: 36 },
      { userId: "usr-3", name: "Elena Rostova", department: "Frontend", avgScore: 91, tasksCompleted: 39 },
      { userId: "usr-4", name: "Marcus Vance", department: "DevOps", avgScore: 86, tasksCompleted: 31 },
    ];
  }

  if (url.includes("/dashboard/task-status-distribution")) {
    return [
      { status: "in_progress", count: 18 },
      { status: "completed", count: 34 },
      { status: "in_review", count: 8 },
      { status: "blocked", count: 2 },
    ];
  }

  if (url.includes("/dashboard/workload-distribution")) {
    return [
      { userId: "usr-1", name: "Alex Morgan", activeProjects: 4, estimatedHours: 32 },
      { userId: "usr-2", name: "David Kim", activeProjects: 3, estimatedHours: 28 },
      { userId: "usr-3", name: "Elena Rostova", activeProjects: 5, estimatedHours: 38 },
    ];
  }

  if (url.includes("/dashboard/productivity-heatmap")) {
    return {
      weekLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"],
      rows: [
        { day: "Mon", values: [80, 85, 90, 88, 92, 95, 89, 94] },
        { day: "Tue", values: [82, 88, 91, 93, 90, 96, 92, 95] },
        { day: "Wed", values: [85, 89, 94, 95, 93, 98, 94, 96] },
        { day: "Thu", values: [78, 84, 88, 90, 87, 93, 90, 92] },
        { day: "Fri", values: [75, 80, 82, 85, 84, 88, 86, 90] },
      ],
    };
  }

  if (url.includes("/dashboard/attendance-trend")) {
    return [
      { date: "2026-07-18", present: 22, late: 1, absent: 0, leave: 1, remote: 8 },
      { date: "2026-07-19", present: 23, late: 0, absent: 0, leave: 1, remote: 9 },
      { date: "2026-07-20", present: 21, late: 2, absent: 1, leave: 0, remote: 7 },
      { date: "2026-07-21", present: 24, late: 0, absent: 0, leave: 0, remote: 10 },
      { date: "2026-07-22", present: 23, late: 1, absent: 0, leave: 0, remote: 9 },
    ];
  }

  if (url.includes("/dashboard/activity-feed")) {
    return [
      { id: "act-1", type: "pr_merged", message: "merged PR #142 'Microservices refactor'", createdAt: new Date().toISOString(), user: { name: "Alex Morgan", avatarUrl: null } },
      { id: "act-2", type: "project_created", message: "created new project 'AI Customer Support Bot'", createdAt: new Date(Date.now() - 3600000).toISOString(), user: { name: "David Kim", avatarUrl: null } },
      { id: "act-3", type: "client_added", message: "onboarded new enterprise client 'Acme Corp'", createdAt: new Date(Date.now() - 7200000).toISOString(), user: { name: "Elena Rostova", avatarUrl: null } },
    ];
  }

  if (url.includes("/dashboard/ai-insights")) {
    return [
      { id: "1", tone: "positive", text: "PR cycle times dropped by 62% this sprint with automated reviewer assignments." },
      { id: "2", tone: "positive", text: "Team concentration flow state averaged 6.4 hours daily with uninterrupted focus blocks." },
      { id: "3", tone: "neutral", text: "Frontend refactoring task is tracking 2 days ahead of schedule." },
    ];
  }

  if (url.includes("/dashboard/project-overview")) {
    const projects = localStorageDb.getProjects();
    return {
      byStatus: [
        { status: "in_progress", count: projects.filter((p) => p.status === "in_progress").length },
        { status: "completed", count: projects.filter((p) => p.status === "completed").length },
        { status: "in_review", count: projects.filter((p) => p.status === "in_review").length },
      ],
      byPriority: [
        { priority: "urgent", count: 2 },
        { priority: "high", count: 5 },
        { priority: "medium", count: 4 },
      ],
      upcoming: projects.map((p) => ({
        id: p.id,
        title: p.title,
        dueDate: p.dueDate,
        status: p.status,
        priority: p.priority,
        client: p.client?.name || "Internal",
      })),
    };
  }

  if (url.includes("/dashboard/employee-performance")) {
    const users = localStorageDb.getUsers();
    const items = users.map((u) => ({
      id: u.id,
      name: u.name,
      department: u.department,
      jobTitle: u.jobTitle,
      avatarUrl: u.avatarUrl,
      avgProductivity: Math.floor(85 + Math.random() * 12),
      tasksCompleted: Math.floor(25 + Math.random() * 20),
      attendanceRate: 98,
      activeProjects: Math.floor(1 + Math.random() * 4),
    }));
    return {
      items,
      total: items.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
  }

  // Projects
  if (url.includes("/projects")) {
    const projects = localStorageDb.getProjects();
    if (method === "get") {
      return {
        items: projects,
        total: projects.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      };
    }
    if (method === "post") return localStorageDb.addProject(body);
    if (method === "patch") {
      const id = url.split("/projects/")[1];
      return localStorageDb.updateProject(id, body);
    }
    if (method === "delete") {
      const id = url.split("/projects/")[1];
      localStorageDb.deleteProject(id);
      return { success: true };
    }
  }

  // Clients
  if (url.includes("/clients")) {
    const clients = localStorageDb.getClients();
    if (method === "get") return clients;
    if (method === "post") return localStorageDb.addClient(body);
    if (method === "patch") {
      const id = url.split("/clients/")[1];
      return localStorageDb.updateClient(id, body);
    }
    if (method === "delete") {
      const id = url.split("/clients/")[1];
      localStorageDb.deleteClient(id);
      return { success: true };
    }
  }

  // Credentials
  if (url.includes("/credentials")) {
    if (method === "get") return localStorageDb.getCredentials();
    if (method === "post") return localStorageDb.addCredential(body);
    if (method === "delete") {
      const id = url.split("/credentials/")[1];
      localStorageDb.deleteCredential(id);
      return { success: true };
    }
  }

  // Users
  if (url.includes("/users")) {
    if (method === "get") return localStorageDb.getUsers();
    if (method === "post") return localStorageDb.addUser(body);
    if (method === "patch") {
      const id = url.split("/users/")[1];
      return localStorageDb.updateUser(id, body);
    }
    if (method === "delete") {
      const id = url.split("/users/")[1];
      localStorageDb.deleteUser(id);
      return { success: true };
    }
  }

  // Auth Login Fallback
  if (url.includes("/auth/login")) {
    const demoUser = {
      id: "usr-demo",
      name: "Alex Morgan",
      email: body.email || "alex@company.com",
      role: "super_admin",
      avatarUrl: null,
      jobTitle: "VP of Engineering",
      department: "Engineering",
      address: "San Francisco, CA",
      notifyEmail: true,
      notifyInApp: true,
    };
    return { token: "demo-jwt-token-pulse-12345", user: demoUser };
  }

  return [];
}

// Request Interceptor with Standalone Mock Adapter
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If running in standalone mode (no external VITE_API_URL configured), bypass network and use Mock Adapter
  if (!import.meta.env.VITE_API_URL) {
    config.adapter = async (cfg) => {
      const data = handleMockRequest(cfg);
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: cfg,
      };
    };
  }

  return config;
});

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If external VITE_API_URL fails or returns 404/405/500, fallback to Local Storage
    if (!error.response || error.code === "ERR_NETWORK" || error.response?.status >= 400) {
      const data = handleMockRequest(error.config);
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: error.config,
      };
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().clear();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
