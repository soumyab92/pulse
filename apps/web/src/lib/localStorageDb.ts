import type { AdminUser, Client, Credential, OrgSettings, Plan, Project } from "@/types/api";

const KEYS = {
  PLAN: "pulse_plan_settings",
  PROJECTS: "pulse_projects",
  CLIENTS: "pulse_clients",
  CREDENTIALS: "pulse_credentials",
  USERS: "pulse_users",
};

// Initial Seed Data for Local Browser Storage
const INITIAL_PLAN: OrgSettings = {
  id: "org-1",
  plan: "pro",
  updatedAt: new Date().toISOString(),
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Acme Corporation",
    company: "Acme Global Industries",
    email: "contact@acme.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, OR",
    logoColor: "#2563eb",
    status: "active",
    createdAt: "2026-01-15T00:00:00Z",
    _count: { projects: 4 },
  },
  {
    id: "cli-2",
    name: "ScaleFlow Tech",
    company: "ScaleFlow Inc.",
    email: "hello@scaleflow.io",
    phone: "+1 (555) 987-6543",
    address: "100 Innovation Way, San Francisco, CA",
    logoColor: "#10b981",
    status: "active",
    createdAt: "2026-02-20T00:00:00Z",
    _count: { projects: 2 },
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-101",
    title: "E-Commerce Microservices Refactor",
    description: "Refactoring legacy monolithic API into high-performance Node.js microservices.",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-08-30",
    estimatedHours: 120,
    notes: "High priority backend milestone",
    createdAt: "2026-05-01T08:00:00Z",
    updatedAt: "2026-07-20T10:30:00Z",
    client: INITIAL_CLIENTS[0],
    assignees: [{ id: "usr-1", name: "Alex Morgan", avatarUrl: null }],
    tags: ["Backend", "Microservices", "Node.js"],
    attachments: [],
  },
  {
    id: "proj-102",
    title: "Mobile App Dark Theme & Design Tokens",
    description: "Implementing theme engine and tokenized UI design system.",
    priority: "medium",
    status: "completed",
    dueDate: "2026-06-15",
    estimatedHours: 45,
    notes: "Completed design token integration",
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-06-15T16:00:00Z",
    client: INITIAL_CLIENTS[1],
    assignees: [{ id: "usr-2", name: "David Kim", avatarUrl: null }],
    tags: ["Mobile", "UI/UX"],
    attachments: [],
  },
];

const INITIAL_CREDENTIALS: Credential[] = [
  {
    id: "cred-1",
    toolName: "GitHub CI Bot",
    username: "pulse-ci-bot",
    notes: "Production deployment bot key",
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
    maskedSecret: "demo_github_token_pulse_sample_12345",
  },
  {
    id: "cred-2",
    toolName: "AWS Production Console",
    username: "ops@pulse.dev",
    notes: "Root cloud infrastructure access",
    createdAt: "2026-04-12T00:00:00Z",
    updatedAt: "2026-04-12T00:00:00Z",
    maskedSecret: "DEMO_AWS_KEY_PULSE_SAMPLE_12345",
  },
];

const INITIAL_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Alex Morgan",
    email: "alex@company.com",
    avatarUrl: null,
    department: "Engineering",
    jobTitle: "VP of Engineering",
    address: "San Francisco, CA",
    role: "super_admin",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-2",
    name: "David Kim",
    email: "david@company.com",
    avatarUrl: null,
    department: "Backend",
    jobTitle: "Lead Architect",
    address: "Austin, TX",
    role: "admin",
    isActive: true,
    createdAt: "2026-02-15T00:00:00Z",
  },
];

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("LocalStorage error:", err);
  }
}

export const localStorageDb = {
  // Plan Settings
  getPlan(): OrgSettings {
    return getItem(KEYS.PLAN, INITIAL_PLAN);
  },

  updatePlan(plan: Plan): OrgSettings {
    const current = this.getPlan();
    const updated: OrgSettings = { ...current, plan, updatedAt: new Date().toISOString() };
    setItem(KEYS.PLAN, updated);
    return updated;
  },

  // Projects
  getProjects(): Project[] {
    return getItem(KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  addProject(projectData: any): Project {
    const projects = this.getProjects();
    const clients = this.getClients();
    const client = clients.find((c) => c.id === projectData.clientId) || null;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: projectData.title || "New Project",
      description: projectData.description || null,
      priority: projectData.priority || "medium",
      status: projectData.status || "in_progress",
      dueDate: projectData.dueDate || null,
      estimatedHours: projectData.estimatedHours || null,
      notes: projectData.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client,
      assignees: [],
      tags: projectData.tags || [],
      attachments: [],
    };
    setItem(KEYS.PROJECTS, [newProject, ...projects]);
    return newProject;
  },

  updateProject(id: string, updates: any): Project {
    const projects = this.getProjects();
    let updatedProj: Project | null = null;
    const newProjects = projects.map((p) => {
      if (p.id === id) {
        updatedProj = { ...p, ...updates, updatedAt: new Date().toISOString() };
        return updatedProj;
      }
      return p;
    });
    setItem(KEYS.PROJECTS, newProjects);
    return updatedProj || (updates as Project);
  },

  deleteProject(id: string): void {
    const projects = this.getProjects();
    setItem(KEYS.PROJECTS, projects.filter((p) => p.id !== id));
  },

  // Clients
  getClients(): Client[] {
    return getItem(KEYS.CLIENTS, INITIAL_CLIENTS);
  },

  addClient(clientData: any): Client {
    const clients = this.getClients();
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: clientData.name || "New Client",
      company: clientData.company || null,
      email: clientData.email || null,
      phone: clientData.phone || null,
      address: clientData.address || null,
      logoColor: clientData.logoColor || "#2563eb",
      status: clientData.status || "active",
      createdAt: new Date().toISOString(),
      _count: { projects: 0 },
    };
    setItem(KEYS.CLIENTS, [newClient, ...clients]);
    return newClient;
  },

  updateClient(id: string, updates: any): Client {
    const clients = this.getClients();
    let updatedCli: Client | null = null;
    const newClients = clients.map((c) => {
      if (c.id === id) {
        updatedCli = { ...c, ...updates };
        return updatedCli;
      }
      return c;
    });
    setItem(KEYS.CLIENTS, newClients);
    return updatedCli || (updates as Client);
  },

  deleteClient(id: string): void {
    const clients = this.getClients();
    setItem(KEYS.CLIENTS, clients.filter((c) => c.id !== id));
  },

  // Credentials
  getCredentials(): Credential[] {
    return getItem(KEYS.CREDENTIALS, INITIAL_CREDENTIALS);
  },

  addCredential(credData: { toolName: string; username: string; secret: string; notes?: string }): Credential {
    const creds = this.getCredentials();
    const newCred: Credential = {
      id: `cred-${Date.now()}`,
      toolName: credData.toolName,
      username: credData.username,
      notes: credData.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      maskedSecret: credData.secret ? "••••••••••••••••" : "••••••••••••••••",
    };
    setItem(KEYS.CREDENTIALS, [newCred, ...creds]);
    return newCred;
  },

  deleteCredential(id: string): void {
    const creds = this.getCredentials();
    setItem(KEYS.CREDENTIALS, creds.filter((c) => c.id !== id));
  },

  // Users
  getUsers(): AdminUser[] {
    return getItem(KEYS.USERS, INITIAL_USERS);
  },

  addUser(userData: any): AdminUser {
    const users = this.getUsers();
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || "New Team Member",
      email: userData.email || "",
      avatarUrl: null,
      department: userData.department || "Engineering",
      jobTitle: userData.jobTitle || "Developer",
      address: userData.address || null,
      role: userData.role || "member",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setItem(KEYS.USERS, [newUser, ...users]);
    return newUser;
  },

  updateUser(id: string, updates: any): AdminUser {
    const users = this.getUsers();
    let updatedUser: AdminUser | null = null;
    const newUsers = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });
    setItem(KEYS.USERS, newUsers);
    return updatedUser || (updates as AdminUser);
  },

  deleteUser(id: string): void {
    const users = this.getUsers();
    setItem(KEYS.USERS, users.filter((u) => u.id !== id));
  },
};
