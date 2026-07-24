import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Download, History, Receipt, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { usePlan } from "./api";
import { useBillingStore } from "@/stores/billingStore";
import type { Plan } from "@/types/api";

interface PlanDef {
  id: Plan;
  name: string;
  priceDisplay: string;
  description: string;
  features: string[];
}

const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    priceDisplay: "$0",
    description: "For small teams getting started",
    features: ["Up to 15 team members", "Up to 30 active projects", "30-day dashboard history", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    priceDisplay: "$29",
    description: "For growing teams that need more room",
    features: [
      "Up to 50 team members",
      "Unlimited projects",
      "12-month dashboard history",
      "Encrypted credential vault",
      "Priority email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceDisplay: "$99",
    description: "For organizations with advanced needs",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Full historical analytics",
      "SSO & audit logs",
      "Dedicated success manager",
    ],
  },
];

const PLAN_RANK: Record<Plan, number> = { free: 0, pro: 1, enterprise: 2 };

export function BillingPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = usePlan();
  const orderHistory = useBillingStore((s) => s.orderHistory);

  const currentPlan = settings?.plan ?? "free";

  return (
    <div className="space-y-10">
      <PageHeader
        title="Plans & Billing"
        description="Manage your workspace subscription plan and view past order history & invoices."
      />

      {/* Pricing Cards Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Available Plans</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan];
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "flex flex-col p-6 transition-all",
                    isCurrent && "border-brand-500 ring-1 ring-brand-500/30 bg-brand-500/5",
                    plan.id === "pro" && !isCurrent && "border-brand-500/50 shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-text-primary">{plan.name}</h3>
                    {isCurrent && <Badge tone="blue">Current plan</Badge>}
                    {plan.id === "pro" && !isCurrent && <Badge tone="amber">Popular</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-text-tertiary">{plan.description}</p>
                  <p className="mt-4">
                    <span className="text-3xl font-semibold tracking-tight text-text-primary">{plan.priceDisplay}</span>
                    <span className="text-sm text-text-tertiary"> / month</span>
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-600 dark:text-success-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-6 w-full justify-center text-center"
                    variant={isCurrent ? "secondary" : "primary"}
                    disabled={isCurrent}
                    onClick={() => navigate(`/billing/checkout?plan=${plan.id}`)}
                  >
                    {isCurrent ? "Current plan" : isDowngrade ? `Switch to ${plan.name}` : `Upgrade to ${plan.name}`}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Order History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-text-primary">Order History & Invoices</h2>
          </div>
          <span className="text-xs text-text-tertiary">{orderHistory.length} Total Invoices</span>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-bg/80 text-text-tertiary font-semibold">
                <tr>
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Cycle</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary">
                {orderHistory.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-bg/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-text-primary">{invoice.id}</td>
                    <td className="px-4 py-3">{invoice.date}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{invoice.planName}</td>
                    <td className="px-4 py-3 capitalize">{invoice.billingCycle}</td>
                    <td className="px-4 py-3 font-semibold text-text-primary">{invoice.amount}</td>
                    <td className="px-4 py-3">{invoice.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/billing/thank-you?invoiceId=${invoice.id}&plan=${invoice.planName}&amount=${invoice.amount.replace("$", "")}&cycle=${invoice.billingCycle}`)}
                        className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                      >
                        <Receipt className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
