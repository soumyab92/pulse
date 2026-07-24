import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/profile");
      return data;
    },
  });
}

export interface UpdateProfileInput {
  name?: string;
  jobTitle?: string;
  department?: string;
  address?: string;
  notifyEmail?: boolean;
  notifyInApp?: boolean;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const { data } = await apiClient.patch<User>("/profile", input);
      return data;
    },
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
