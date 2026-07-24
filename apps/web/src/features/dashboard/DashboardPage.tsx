import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiRow } from "./widgets/KpiRow";
import { ProductivityTrendCard } from "./widgets/ProductivityTrendCard";
import { AiInsightsCard } from "./widgets/AiInsightsCard";
import { TeamComparisonCard } from "./widgets/TeamComparisonCard";
import { TaskStatusDistributionCard } from "./widgets/TaskStatusDistributionCard";
import { WorkloadDistributionCard } from "./widgets/WorkloadDistributionCard";
import { TaskProgressCard } from "./widgets/TaskProgressCard";
import { ProductivityHeatmapCard } from "./widgets/ProductivityHeatmapCard";
import { AttendanceTrendCard } from "./widgets/AttendanceTrendCard";
import { RecentActivityCard } from "./widgets/RecentActivityCard";
import { ProjectOverviewCard } from "./widgets/ProjectOverviewCard";
import { EmployeePerformanceTable } from "./widgets/EmployeePerformanceTable";

function Section({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="How is my team performing today?" />

      <div className="space-y-5">
        {/* Charts render first — the headline trend + AI read on the week, before the raw KPI tally. */}
        <Section delay={0}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8">
              <ProductivityTrendCard />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <AiInsightsCard />
            </div>
          </div>
        </Section>

        <KpiRow />

        <Section delay={0.3}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6">
              <TeamComparisonCard />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <TaskStatusDistributionCard />
            </div>
          </div>
        </Section>

        <Section delay={0.36}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6">
              <WorkloadDistributionCard />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <TaskProgressCard />
            </div>
          </div>
        </Section>

        <Section delay={0.42}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6">
              <ProductivityHeatmapCard />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <AttendanceTrendCard />
            </div>
          </div>
        </Section>

        <Section delay={0.48}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-5">
              <RecentActivityCard />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ProjectOverviewCard />
            </div>
          </div>
        </Section>

        <Section delay={0.54}>
          <EmployeePerformanceTable />
        </Section>
      </div>
    </div>
  );
}
