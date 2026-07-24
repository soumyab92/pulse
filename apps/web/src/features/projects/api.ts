import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Paginated, Project, ProjectPriority, ProjectStatus } from "@/types/api";

export interface ProjectFilters {
  q?: string;
  status?: ProjectStatus | "";
  priority?: ProjectPriority | "";
  clientId?: string;
  assigneeId?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

function cleanParams(filters: ProjectFilters) {
  return {
    q: filters.q || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    clientId: filters.clientId || undefined,
    assigneeId: filters.assigneeId || undefined,
    page: filters.page,
    pageSize: filters.pageSize,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  };
}

export function useProjects(filters: ProjectFilters, scope: "all" | "mine" = "all") {
  return useQuery({
    queryKey: ["projects", scope, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<Project>>(
        scope === "mine" ? "/projects/mine" : "/projects",
        { params: cleanParams(filters) },
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  clientId?: string | null;
  priority: ProjectPriority;
  status: ProjectStatus;
  dueDate?: string | null;
  estimatedHours?: number | null;
  notes?: string;
  assigneeIds: string[];
  tags: string[];
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await apiClient.post<Project>("/projects", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUploadAttachment() {
  return useMutation({
    mutationFn: async ({
      projectId,
      file,
      onProgress,
    }: {
      projectId: string;
      file: File;
      onProgress?: (percent: number) => void;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClient.post(`/projects/${projectId}/attachments`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) onProgress?.(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      return data;
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CreateProjectInput> }) => {
      const { data } = await apiClient.patch<Project>(`/projects/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
