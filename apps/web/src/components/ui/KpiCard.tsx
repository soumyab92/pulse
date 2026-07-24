import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import { Card } from "./Card";

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: { direction: "up" | "down"; label: string; positive?: boolean };
  delay?: number;
}

export function KpiCard({ label, value, suffix = "", icon: Icon, trend, delay = 0 }: KpiCardProps) {
  const trendGood = trend ? (trend.positive ?? trend.direction === "up") : true;
  const displayValue = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
    >
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg">
            <Icon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary tabular-nums">
          {displayValue}
          {suffix}
        </p>
        {trend && (
          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              trendGood ? "text-success-600 dark:text-success-500" : "text-danger-600 dark:text-danger-500",
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {trend.label}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
