import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types/api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>("/users");
      return data;
    },
    staleTime: 5 * 60_000,
  });
}
