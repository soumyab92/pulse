import { Activity } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { useActivityFeed } from "@/lib/queries/activity";
import { formatRelativeTime } from "@/lib/formatters";

export function RecentActivityCard() {
  const { data, isLoading } = useActivityFeed(8);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your team</CardDescription>
        </div>
      </CardHeader>
      <div className="p-5 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <Avatar name={event.user?.name ?? "System"} src={event.user?.avatarUrl} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{event.user?.name ?? "Someone"}</span>{" "}
                    <span className="text-text-secondary">{event.message}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{formatRelativeTime(event.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Activity} title="No recent activity" />
        )}
      </div>
    </Card>
  );
}
