import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { OrgSettings, Plan } from "@/types/api";

export function usePlan() {
  return useQuery({
    queryKey: ["org-plan"],
    queryFn: async () => {
      const { data } = await apiClient.get<OrgSettings>("/settings/plan");
      return data;
    },
  });
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: Plan) => {
      const { data } = await apiClient.patch<OrgSettings>("/settings/plan", { plan });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-plan"] });
    },
  });
}
