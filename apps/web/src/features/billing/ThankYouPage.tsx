import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Download, Receipt, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const invoiceId = searchParams.get("invoiceId") || "INV-2026-0891";
  const planName = searchParams.get("plan") || "Pro";
  const amount = searchParams.get("amount") || "29";
  const cycle = searchParams.get("cycle") || "monthly";

  return (
    <div className="mx-auto max-w-2xl py-8 space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
          Thank You for Your Order!
        </h1>
        <p className="text-base text-text-secondary">
          Your payment was processed successfully in demo mode. Your workspace has been upgraded to the <span className="font-semibold text-text-primary">{planName} Plan</span>.
        </p>
      </div>

      {/* Invoice Summary Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-600" />
            <span className="text-sm font-semibold text-text-primary">Order Confirmation Receipt</span>
          </div>
          <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Paid & Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-text-tertiary">Invoice Number</span>
            <p className="font-mono font-semibold text-text-primary mt-0.5">{invoiceId}</p>
          </div>
          <div>
            <span className="text-text-tertiary">Transaction Date</span>
            <p className="font-semibold text-text-primary mt-0.5">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
          </div>
          <div>
            <span className="text-text-tertiary">Plan Upgraded</span>
            <p className="font-semibold text-text-primary mt-0.5">{planName} ({cycle})</p>
          </div>
          <div>
            <span className="text-text-tertiary">Total Amount Paid</span>
            <p className="font-semibold text-text-primary mt-0.5">${amount}.00 USD</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg/80 p-3 text-xs text-text-tertiary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Simulated demo invoice record generated.</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <Download className="h-3.5 w-3.5" /> Print Receipt
          </button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
          size="lg"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link
          to="/billing"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}
