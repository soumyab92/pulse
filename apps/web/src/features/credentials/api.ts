import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Credential } from "@/types/api";

export function useCredentials() {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const { data } = await apiClient.get<Credential[]>("/credentials");
      return data;
    },
  });
}

export interface CredentialInput {
  toolName: string;
  username: string;
  secret?: string;
  notes?: string;
}

export function useCreateCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CredentialInput) => {
      const { data } = await apiClient.post<Credential>("/credentials", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credentials"] }),
  });
}

export function useUpdateCredential(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<CredentialInput>) => {
      const { data } = await apiClient.patch<Credential>(`/credentials/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credentials"] }),
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/credentials/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credentials"] }),
  });
}

export function useRevealCredential() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post<{ secret: string }>(`/credentials/${id}/reveal`);
      return data.secret;
    },
  });
}
