import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useAiInsights } from "../api";

const TONE_STYLES = {
  positive: { icon: TrendingUp, className: "text-success-600 dark:text-success-500 bg-success-50 dark:bg-success-500/10" },
  warning: { icon: AlertTriangle, className: "text-warning-600 dark:text-warning-500 bg-warning-50 dark:bg-warning-500/10" },
  neutral: { icon: Sparkles, className: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20" },
};

export function AiInsightsCard() {
  const { data, isLoading } = useAiInsights();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Automated observations from this week's data</CardDescription>
        </div>
      </CardHeader>
      <div className="space-y-3 p-5 pt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
        ) : (
          data?.map((insight) => {
            const tone = TONE_STYLES[insight.tone];
            const Icon = tone.icon;
            return (
              <div key={insight.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", tone.className)}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <p className="text-sm text-text-secondary">{insight.text}</p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
