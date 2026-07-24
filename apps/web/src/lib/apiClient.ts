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

// Intercept responses: If network connection fails (offline static Vercel/Netlify deployment), handle in Local Browser Storage
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend server is unreachable or offline static host, handle with Local Browser Storage
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
