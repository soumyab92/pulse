import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Client } from "@/types/api";

export function useClients(q?: string) {
  return useQuery({
    queryKey: ["clients", q ?? ""],
    queryFn: async () => {
      const { data } = await apiClient.get<Client[]>("/clients", { params: q ? { q } : undefined });
      return data;
    },
  });
}

export interface CreateClientInput {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateClientInput) => {
      const { data } = await apiClient.post<Client>("/clients", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<CreateClientInput>) => {
      const { data } = await apiClient.patch<Client>(`/clients/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
