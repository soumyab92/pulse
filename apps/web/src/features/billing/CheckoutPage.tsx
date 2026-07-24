import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FieldLabel } from "@/components/ui/Input";
import { useUpgradePlan } from "./api";
import { useBillingStore } from "@/stores/billingStore";
import type { Plan } from "@/types/api";

const PLAN_DETAILS: Record<string, { name: string; price: number; description: string }> = {
  free: { name: "Free", price: 0, description: "Small teams getting started" },
  pro: { name: "Pro", price: 29, description: "Growing teams needing unlimited projects & 12mo history" },
  enterprise: { name: "Enterprise", price: 99, description: "Organizations needing custom SLA & SSO audit logs" },
};

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const upgradePlan = useUpgradePlan();
  const addInvoice = useBillingStore((s) => s.addInvoice);

  const planId = (searchParams.get("plan") as Plan) || "pro";
  const planInfo = PLAN_DETAILS[planId] || PLAN_DETAILS["pro"];

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "express">("card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [nameOnCard, setNameOnCard] = useState("Alex Morgan");

  const monthlyPrice = billingCycle === "yearly" ? Math.round(planInfo.price * 0.8) : planInfo.price;
  const totalAmount = billingCycle === "yearly" ? monthlyPrice * 12 : monthlyPrice;

  async function handleCompletePayment(e: React.FormEvent) {
    e.preventDefault();
    try {
      await upgradePlan.mutateAsync(planId);

      // Record invoice into Order History
      const invoice = addInvoice({
        planName: `${planInfo.name} Plan`,
        billingCycle,
        amount: `$${totalAmount}.00`,
        status: "Paid",
        paymentMethod: paymentMethod === "card" ? `Card ending in 4242` : "Express Pay",
      });

      toast.success(`Demo payment complete! Upgrade to ${planInfo.name} active.`);
      
      // Redirect to Thank You Page with invoice details
      navigate(`/billing/thank-you?invoiceId=${invoice.id}&plan=${planInfo.name}&amount=${totalAmount}&cycle=${billingCycle}`);
    } catch {
      toast.error("Failed to process demo payment.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-tertiary">
        <Link to="/billing" className="flex items-center gap-1 hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Billing
        </Link>
        <span>/</span>
        <span className="text-text-primary font-medium">Checkout</span>
      </div>

      <PageHeader
        title={`Checkout — ${planInfo.name} Plan`}
        description="Review your order details and complete demo payment to activate workspace upgrades."
      />

      {/* Demo Mode Notice Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-brand-500/30 bg-brand-500/10 p-4 text-xs text-brand-700 dark:text-brand-300">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
        <div>
          <span className="font-bold">Demo Checkout Mode Active</span>
          <p className="mt-0.5 opacity-90">
            This is a simulated demo checkout environment. Pre-filled test payment details are provided. No real card will be charged.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Payment Form */}
        <div className="md:col-span-7 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary">1. Billing Cycle</h3>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-xs">
              <span className="text-text-secondary font-medium">Cycle Options:</span>
              <div className="flex gap-1 rounded-md border border-border bg-bg p-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded px-3 py-1 font-medium transition-colors ${
                    billingCycle === "monthly" ? "bg-brand-600 text-white" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`rounded px-3 py-1 font-medium transition-colors ${
                    billingCycle === "yearly" ? "bg-brand-600 text-white" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary">2. Demo Payment Information</h3>

            <form onSubmit={handleCompletePayment} className="mt-4 space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-2.5 text-xs font-medium transition-all ${
                    paymentMethod === "card"
                      ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : "border-border bg-surface text-text-secondary"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("express")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-2.5 text-xs font-medium transition-all ${
                    paymentMethod === "express"
                      ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : "border-border bg-surface text-text-secondary"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Express Pay
                </button>
              </div>

              <div>
                <FieldLabel required>Cardholder Name</FieldLabel>
                <Input
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                />
              </div>

              <div>
                <FieldLabel required>Card Number</FieldLabel>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 •••• •••• 4242"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>Expiration</FieldLabel>
                  <Input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>CVC</FieldLabel>
                  <Input
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full justify-center text-center mt-2"
                size="lg"
                loading={upgradePlan.isPending}
              >
                Complete Demo Payment (${totalAmount}.00)
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Order Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Selected Plan:</span>
                <span className="font-semibold text-text-primary">{planInfo.name}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Billing Period:</span>
                <span className="capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Rate:</span>
                <span>${monthlyPrice} / month</span>
              </div>
              {billingCycle === "yearly" && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Annual 20% Discount:</span>
                  <span>Applied</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Taxes & Fees:</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-bold text-text-primary">
                <span>Total Due Today:</span>
                <span>${totalAmount}.00</span>
              </div>
            </div>

            <div className="rounded border border-border bg-surface p-3 text-xs text-text-tertiary space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Instant Upgrade Guarantee</span>
              </div>
              <p>Your team will immediately get full access to all {planInfo.name} features upon payment confirmation.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
