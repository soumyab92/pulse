import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ActivityEvent } from "@/types/api";

export function useActivityFeed(limit = 20) {
  return useQuery({
    queryKey: ["activity-feed", limit],
    queryFn: async () => {
      const { data } = await apiClient.get<ActivityEvent[]>("/dashboard/activity-feed", {
        params: { limit },
      });
      return data;
    },
  });
}
