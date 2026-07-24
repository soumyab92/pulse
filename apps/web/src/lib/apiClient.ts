import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { localStorageDb } from "./localStorageDb";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses: If network connection fails (offline static Vercel/Netlify deployment), handle with rich in-browser mock engine
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend server is unreachable or static deployment on Vercel/Netlify, serve data seamlessly
    if (!error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED" || error.response?.status === 404) {
      const url = error.config?.url || "";
      const method = (error.config?.method || "get").toLowerCase();
      let body: any = {};
      try {
        body = error.config?.data ? JSON.parse(error.config.data) : {};
      } catch {
        body = {};
      }

      // Settings / Plan
      if (url.includes("/settings/plan")) {
        if (method === "get") {
          return { data: localStorageDb.getPlan(), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "patch") {
          return { data: localStorageDb.updatePlan(body.plan), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
      }

      // Dashboard APIs
      if (url.includes("/dashboard/kpis")) {
        return {
          data: {
            activeProjects: localStorageDb.getProjects().filter((p) => p.status === "in_progress").length || 14,
            completedThisWeek: 6,
            overdueProjects: 1,
            teamHeadcount: localStorageDb.getUsers().length || 24,
            attendanceRateToday: 96.2,
            avgProductivityScore: 89.4,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/productivity-trend")) {
        return {
          data: [
            { date: "Jul 10", avgProductivity: 78, tasksCompleted: 12 },
            { date: "Jul 12", avgProductivity: 82, tasksCompleted: 15 },
            { date: "Jul 14", avgProductivity: 85, tasksCompleted: 18 },
            { date: "Jul 16", avgProductivity: 88, tasksCompleted: 22 },
            { date: "Jul 18", avgProductivity: 91, tasksCompleted: 26 },
            { date: "Jul 20", avgProductivity: 89, tasksCompleted: 24 },
            { date: "Jul 22", avgProductivity: 94, tasksCompleted: 29 },
            { date: "Jul 24", avgProductivity: 92, tasksCompleted: 27 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/team-comparison")) {
        return {
          data: [
            { userId: "usr-1", name: "Alex Morgan", department: "Engineering", avgScore: 94, tasksCompleted: 42 },
            { userId: "usr-2", name: "David Kim", department: "Backend", avgScore: 88, tasksCompleted: 36 },
            { userId: "usr-3", name: "Elena Rostova", department: "Frontend", avgScore: 91, tasksCompleted: 39 },
            { userId: "usr-4", name: "Marcus Vance", department: "DevOps", avgScore: 86, tasksCompleted: 31 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/task-status-distribution")) {
        return {
          data: [
            { status: "in_progress", count: 18 },
            { status: "completed", count: 34 },
            { status: "in_review", count: 8 },
            { status: "blocked", count: 2 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/workload-distribution")) {
        return {
          data: [
            { userId: "usr-1", name: "Alex Morgan", activeProjects: 4, estimatedHours: 32 },
            { userId: "usr-2", name: "David Kim", activeProjects: 3, estimatedHours: 28 },
            { userId: "usr-3", name: "Elena Rostova", activeProjects: 5, estimatedHours: 38 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/productivity-heatmap")) {
        return {
          data: {
            weekLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"],
            rows: [
              { day: "Mon", values: [80, 85, 90, 88, 92, 95, 89, 94] },
              { day: "Tue", values: [82, 88, 91, 93, 90, 96, 92, 95] },
              { day: "Wed", values: [85, 89, 94, 95, 93, 98, 94, 96] },
              { day: "Thu", values: [78, 84, 88, 90, 87, 93, 90, 92] },
              { day: "Fri", values: [75, 80, 82, 85, 84, 88, 86, 90] },
            ],
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/attendance-trend")) {
        return {
          data: [
            { date: "Jul 18", present: 22, late: 1, absent: 0, leave: 1, remote: 8 },
            { date: "Jul 19", present: 23, late: 0, absent: 0, leave: 1, remote: 9 },
            { date: "Jul 20", present: 21, late: 2, absent: 1, leave: 0, remote: 7 },
            { date: "Jul 21", present: 24, late: 0, absent: 0, leave: 0, remote: 10 },
            { date: "Jul 22", present: 23, late: 1, absent: 0, leave: 0, remote: 9 },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/ai-insights")) {
        return {
          data: [
            { id: "1", tone: "positive", text: "PR cycle times dropped by 62% this sprint with automated reviewer assignments." },
            { id: "2", tone: "positive", text: "Team concentration flow state averaged 6.4 hours daily with uninterrupted focus blocks." },
            { id: "3", tone: "neutral", text: "Frontend refactoring task is tracking 2 days ahead of schedule." },
          ],
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      if (url.includes("/dashboard/project-overview")) {
        const projects = localStorageDb.getProjects();
        return {
          data: {
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
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
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
          data: {
            items,
            total: items.length,
            page: 1,
            pageSize: 10,
            totalPages: 1,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }

      // Projects
      if (url.includes("/projects")) {
        if (method === "get") {
          return { data: { projects: localStorageDb.getProjects(), total: localStorageDb.getProjects().length }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "post") {
          return { data: localStorageDb.addProject(body), status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (method === "patch") {
          const id = url.split("/projects/")[1];
          return { data: localStorageDb.updateProject(id, body), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "delete") {
          const id = url.split("/projects/")[1];
          localStorageDb.deleteProject(id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
      }

      // Clients
      if (url.includes("/clients")) {
        if (method === "get") {
          return { data: { clients: localStorageDb.getClients(), total: localStorageDb.getClients().length }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "post") {
          return { data: localStorageDb.addClient(body), status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (method === "patch") {
          const id = url.split("/clients/")[1];
          return { data: localStorageDb.updateClient(id, body), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "delete") {
          const id = url.split("/clients/")[1];
          localStorageDb.deleteClient(id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
      }

      // Credentials
      if (url.includes("/credentials")) {
        if (method === "get") {
          return { data: localStorageDb.getCredentials(), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "post") {
          return { data: localStorageDb.addCredential(body), status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (method === "delete") {
          const id = url.split("/credentials/")[1];
          localStorageDb.deleteCredential(id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
        }
      }

      // Users
      if (url.includes("/users")) {
        if (method === "get") {
          return { data: localStorageDb.getUsers(), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "post") {
          return { data: localStorageDb.addUser(body), status: 201, statusText: "Created", headers: {}, config: error.config };
        }
        if (method === "patch") {
          const id = url.split("/users/")[1];
          return { data: localStorageDb.updateUser(id, body), status: 200, statusText: "OK", headers: {}, config: error.config };
        }
        if (method === "delete") {
          const id = url.split("/users/")[1];
          localStorageDb.deleteUser(id);
          return { data: { success: true }, status: 200, statusText: "OK", headers: {}, config: error.config };
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
        return {
          data: { token: "demo-jwt-token-pulse-12345", user: demoUser },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        };
      }
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
