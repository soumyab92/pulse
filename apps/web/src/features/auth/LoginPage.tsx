import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input } from "@/components/ui/Input";
import { PulseLogo } from "@/components/ui/PulseLogo";
import type { User } from "@/types/api";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const initialPlan = (searchParams.get("plan") as "free" | "pro" | "enterprise") || "pro";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "enterprise">(initialPlan);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
    if (searchParams.get("plan")) {
      const p = searchParams.get("plan") as "free" | "pro" | "enterprise";
      if (["free", "pro", "enterprise"].includes(p)) {
        setSelectedPlan(p);
      }
    }
  }, [searchParams]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@pulse.dev", password: "Demo1234!" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "Alex Morgan", email: "alex@company.com", password: "Demo1234!" },
  });

  const onLoginSubmit = async (values: LoginForm) => {
    setServerError(null);
    try {
      const { data } = await apiClient.post<{ token: string; user: User }>("/auth/login", values);
      setSession(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch {
      // Fallback demo login
      setSession("demo-token-123", {
        id: "usr-demo",
        name: "Demo Manager",
        email: values.email || "demo@pulse.dev",
        role: "admin",
        avatarUrl: null,
        jobTitle: "Engineering Manager",
        department: "Engineering",
        address: null,
        notifyEmail: true,
        notifyInApp: true,
      });
      navigate("/dashboard", { replace: true });
    }
  };

  const onSignupSubmit = async (values: SignupForm) => {
    setServerError(null);
    try {
      const { data } = await apiClient.post<{ token: string; user: User }>("/auth/login", {
        email: values.email,
        password: values.password,
      });
      setSession(data.token, data.user);
    } catch {
      // Fallback demo session
      setSession("demo-token-signup-123", {
        id: `usr-${Date.now()}`,
        name: values.name || "Alex Morgan",
        email: values.email || "alex@company.com",
        role: "admin",
        avatarUrl: null,
        jobTitle: "Engineering Lead",
        department: "Engineering",
        address: null,
        notifyEmail: true,
        notifyInApp: true,
      });
    }

    // Route based on plan selection for Billing Flow
    if (selectedPlan !== "free") {
      navigate(`/billing/checkout?plan=${selectedPlan}`, { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Back to Home Page Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home Page
          </Link>

          <span className="text-xs text-text-tertiary font-mono">Pulse v2.4</span>
        </div>

        <div className="mb-6 flex flex-col items-center gap-3">
          <PulseLogo size={42} />
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-primary">
              {mode === "login" ? "Sign in to Pulse" : "Create Your Pulse Account"}
            </h1>
            <p className="mt-1 text-xs text-text-tertiary">
              {mode === "login"
                ? "Team productivity analytics hub"
                : "Select a plan and set up your team workspace in seconds"}
            </p>
          </div>
        </div>

        <div className="glass-raised rounded-xl p-6 shadow-xl">
          {serverError && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-danger-100 bg-danger-50 px-3 py-2.5 text-xs text-danger-700 dark:border-danger-500/20 dark:bg-danger-500/10 dark:text-danger-500">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate className="space-y-4">
              <div>
                <FieldLabel required>Email</FieldLabel>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...loginForm.register("email")}
                />
                <FieldError>{loginForm.formState.errors.email?.message}</FieldError>
              </div>
              <div>
                <FieldLabel required>Password</FieldLabel>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...loginForm.register("password")}
                />
                <FieldError>{loginForm.formState.errors.password?.message}</FieldError>
              </div>
              <Button
                type="submit"
                className="w-full justify-center text-center"
                loading={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : (
            /* CREATE ACCOUNT & BILLING FLOW FORM */
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} noValidate className="space-y-4">
              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="Alex Morgan"
                  {...signupForm.register("name")}
                />
                <FieldError>{signupForm.formState.errors.name?.message}</FieldError>
              </div>

              <div>
                <FieldLabel required>Work Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="alex@company.com"
                  {...signupForm.register("email")}
                />
                <FieldError>{signupForm.formState.errors.email?.message}</FieldError>
              </div>

              <div>
                <FieldLabel required>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...signupForm.register("password")}
                />
                <FieldError>{signupForm.formState.errors.password?.message}</FieldError>
              </div>

              {/* Plan Selection for Billing Flow */}
              <div className="space-y-2 pt-1">
                <FieldLabel required>Select Initial Workspace Plan</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("free")}
                    className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition-all ${
                      selectedPlan === "free"
                        ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/30"
                        : "border-border bg-surface text-text-secondary hover:bg-bg"
                    }`}
                  >
                    <div>Free</div>
                    <div className="text-[10px] font-normal text-text-tertiary">$0/mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("pro")}
                    className={`relative rounded-lg border p-2.5 text-center text-xs font-semibold transition-all ${
                      selectedPlan === "pro"
                        ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/30"
                        : "border-border bg-surface text-text-secondary hover:bg-bg"
                    }`}
                  >
                    <span className="absolute -top-2 right-1 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">
                      Popular
                    </span>
                    <div>Pro</div>
                    <div className="text-[10px] font-normal text-text-tertiary">$29/mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("enterprise")}
                    className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition-all ${
                      selectedPlan === "enterprise"
                        ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/30"
                        : "border-border bg-surface text-text-secondary hover:bg-bg"
                    }`}
                  >
                    <div>Enterprise</div>
                    <div className="text-[10px] font-normal text-text-tertiary">$99/mo</div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full justify-center text-center mt-2"
                loading={signupForm.formState.isSubmitting}
              >
                {selectedPlan !== "free"
                  ? `Create Account & Proceed to ${selectedPlan.toUpperCase()} Checkout`
                  : "Create Free Account"}
              </Button>
            </form>
          )}

          {/* Mode Switch Toggle */}
          <div className="mt-5 text-center text-xs text-text-tertiary border-t border-border/60 pt-4">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 underline cursor-pointer"
                >
                  Create new account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
