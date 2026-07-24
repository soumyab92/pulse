import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Code2,
  Command,
  Cpu,
  GitBranch,
  GitPullRequest,
  Globe,
  Layers,
  Lock,
  Menu,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { PulseLogo } from "@/components/ui/PulseLogo";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";

function TypewriterEffect({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(timeout);
  }, []);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true);
      }, 1800);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 45 : 90);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-block relative">
      <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-brand-500 bg-clip-text text-transparent pb-1">
        {words[index].substring(0, subIndex)}
      </span>
      <span
        className={`ml-1 inline-block w-[3px] sm:w-[4px] h-[0.72em] bg-brand-500 ${
          blink ? "opacity-100" : "opacity-0"
        } transition-opacity duration-150 rounded-full align-baseline translate-y-[0.05em]`}
      />
    </span>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);
  const user = useAuthStore((s) => s.user);

  const [activeFeatureTab, setActiveFeatureTab] = useState<"analytics" | "sprints" | "security" | "command">("analytics");
  const [homeBillingCycle, setHomeBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Scroll animation setup for Desktop Hero 3D Perspective & Parallax
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const desktopRotateX = useTransform(smoothScroll, [0, 0.5], [15, 0]);
  const desktopScale = useTransform(smoothScroll, [0, 0.5], [0.92, 1.02]);
  const desktopOpacity = useTransform(smoothScroll, [0, 0.6], [0.85, 1]);
  const translateFloatingY1 = useTransform(smoothScroll, [0, 0.5], [0, -45]);
  const translateFloatingY2 = useTransform(smoothScroll, [0, 0.5], [0, 45]);

  const partners = [
    { name: "GitHub", category: "Version Control" },
    { name: "GitLab", category: "CI/CD Pipeline" },
    { name: "Jira", category: "Issue Tracking" },
    { name: "Linear", category: "Project Management" },
    { name: "Slack", category: "Team Communication" },
    { name: "VS Code", category: "Developer Environment" },
  ];

  const reviews = [
    {
      name: "Sarah Lin",
      role: "VP of Engineering",
      company: "ScaleFlow Inc.",
      avatar: "SL",
      rating: 5,
      comment:
        "Pulse completely eliminated our engineering bottlenecks. PR review time dropped by 62% within our first month of rollout.",
    },
    {
      name: "Marcus Vance",
      role: "CTO",
      company: "CloudShift Systems",
      avatar: "MV",
      rating: 5,
      comment:
        "The cleanest, most intuitive productivity analytics tool we've ever used. Zero friction, zero setup headaches, instant ROI.",
    },
    {
      name: "Elena Rostova",
      role: "Engineering Director",
      company: "Nexus Labs",
      avatar: "ER",
      rating: 5,
      comment:
        "Pulse respects developer flow time while giving executive leadership clear visibility into team velocity and project health.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-brand-500 selection:text-white">
      {/* Custom Interactive Cursor (Desktop Only) */}
      <CustomCursor />

      {/* Navigation Header */}
      <header className="glass sticky top-0 z-40 border-b border-border/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <PulseLogo size={32} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Product
            </a>
            <a href="#pricing" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Pricing Plans
            </a>
            <a href="#trust" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Why Pulse
            </a>
            <a href="#reviews" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Customer Reviews
            </a>
            <a href="#partners" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
              Integrations
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-hover hover:bg-brand-700 sm:flex"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?mode=signup&plan=pro"
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-hover hover:bg-brand-700"
                >
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-surface px-4 py-4 md:hidden space-y-3.5 shadow-lg">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-text-primary hover:text-brand-600"
            >
              Product Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-text-primary hover:text-brand-600"
            >
              Pricing Plans
            </a>
            <a
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-text-primary hover:text-brand-600"
            >
              Why Pulse
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-text-primary hover:text-brand-600"
            >
              Customer Reviews
            </a>
            <a
              href="#partners"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-text-primary hover:text-brand-600"
            >
              Integrations
            </a>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full rounded-md bg-brand-600 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-md border border-border bg-bg py-2.5 text-center text-sm font-medium text-text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=signup&plan=pro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-md bg-brand-600 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION */}
      <section ref={targetRef} className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 lg:pt-24 lg:pb-32">
        {/* Ambient Background Mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-brand-600/30 via-indigo-600/20 to-cyan-500/10 blur-[130px] opacity-70" />
          <div
            className="absolute inset-0 opacity-[0.10] dark:opacity-[0.16]"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1.2px, transparent 1.2px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
              </span>
              Next-Gen Engineering Intelligence Platform
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary leading-[1.25] sm:text-6xl sm:leading-[1.15] lg:text-7xl lg:leading-[1.12]">
              Supercharge Engineering Velocity with{" "}
              <TypewriterEffect words={["Pulse", "Real-Time AI", "Actionable Insights", "Automated Flow"]} />
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm text-text-secondary sm:text-lg lg:text-xl">
              Pulse connects your codebase, project boards, and developer workflows into a single real-time intelligence hub — delivering actionable analytics without micro-management.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/login?mode=signup&plan=pro"
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-700 sm:text-base"
              >
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#pricing"
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg sm:text-base"
              >
                View Pricing Plans
              </a>
            </div>
          </div>

          {/* Product Dashboard Preview (Desktop 3D Scroll Perspective, Mobile Clean Native View) */}
          <div className="mt-12 sm:mt-14 [perspective:1200px]">
            <motion.div
              style={
                isDesktop
                  ? { rotateX: desktopRotateX, scale: desktopScale, opacity: desktopOpacity }
                  : undefined
              }
              className="relative mx-auto rounded-2xl border border-border/80 bg-surface/90 p-3 shadow-2xl backdrop-blur-xl sm:p-5 ring-1 ring-white/10"
            >
              {/* Floating Parallax Badges (Desktop Only) */}
              {isDesktop && (
                <>
                  <motion.div
                    style={{ y: translateFloatingY1 }}
                    className="absolute -top-6 -left-6 z-20 hidden rounded-xl border border-border bg-surface p-3.5 shadow-xl sm:flex items-center gap-3 backdrop-blur-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">+62% PR Turnaround</div>
                      <div className="text-[10px] text-text-tertiary">Real-time velocity boost</div>
                    </div>
                  </motion.div>

                  <motion.div
                    style={{ y: translateFloatingY2 }}
                    className="absolute -bottom-6 -right-6 z-20 hidden rounded-xl border border-border bg-surface p-3.5 shadow-xl sm:flex items-center gap-3 backdrop-blur-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">6.8 hrs Flow Time</div>
                      <div className="text-[10px] text-text-tertiary">Deep concentration mode</div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Window Controls Bar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-danger-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-warning-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-success-500/80"></div>
                  <span className="ml-2 text-xs text-text-tertiary font-mono truncate">app.pulse.dev/dashboard</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Live Sync Active
                  </span>
                  <kbd className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-[10px]">⌘K Search</kbd>
                </div>
              </div>

              {/* Dashboard Preview Grid */}
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-bg p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>Sprint Velocity</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">+28.4% vs last cycle</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-text-primary">142 Story Points</div>
                  <div className="mt-3 flex items-end gap-1.5 h-16">
                    {[40, 65, 55, 80, 70, 95, 88].map((val, idx) => (
                      <div key={idx} className="flex-1 rounded-t bg-brand-600/80 hover:bg-brand-600 transition-all" style={{ height: `${val}%` }}></div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-bg p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>PR Cycle Time</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">1.8 hrs average</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-text-primary">94.2% On Time</div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-text-secondary">
                      <span>Review Turnaround</span>
                      <span className="font-medium">42 mins</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface">
                      <div className="h-full w-[78%] rounded-full bg-brand-500"></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-bg p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>Developer Flow State</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">High Concentration</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-text-primary">6.4 hrs / day</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["A", "B", "C", "D"].map((initial, i) => (
                        <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-bg">
                          {initial}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary">+18 team members active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section id="trust" className="border-y border-border/60 bg-surface/50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
            Trusted by 10,000+ High-Performing Engineering Teams Worldwide
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
            {[
              { val: "3.4x", label: "Faster Code Review Cycles" },
              { val: "99.99%", label: "Enterprise Uptime SLA" },
              { val: "$1.2M", label: "Saved in Idle Sprint Capacity" },
              { val: "4.9 / 5", label: "Rating Across 1,200+ Reviews" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-surface p-4 sm:p-6 text-center shadow-xs"
              >
                <div className="text-2xl sm:text-4xl font-extrabold text-brand-600">{stat.val}</div>
                <div className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-500" />
              <span>256-Bit End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" />
              <span>GDPR & ISO 27001 Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT DETAILS SECTION */}
      <section id="features" className="px-4 py-16 sm:py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Everything Needed to Accelerate Your Software Delivery
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
              Built from the ground up for modern engineering managers, tech leads, and developers who demand speed and clarity.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2 border-b border-border/60 pb-4">
            {[
              { id: "analytics", label: "Flow Analytics", icon: BarChart3 },
              { id: "sprints", label: "Sprint Intelligence", icon: GitPullRequest },
              { id: "security", label: "Enterprise Security", icon: Lock },
              { id: "command", label: "⌘K Command Center", icon: Command },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              {activeFeatureTab === "analytics" && (
                <>
                  <div className="inline-flex rounded-md bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Real-Time Developer Flow
                  </div>
                  <h3 className="text-xl font-bold text-text-primary sm:text-3xl">
                    Protect Deep Coding Hours & Prevent Team Burnout
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed sm:text-base">
                    Pulse automatically measures uninterrupted flow time, context switching, and meeting loads — providing teams with clear guidance on how to optimize focus without micromanaging individual developers.
                  </p>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Automatic detection of focus blocks & notification snoozing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Team workload balance indicators to prevent burnout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Zero agent installation required — direct VCS integration</span>
                    </li>
                  </ul>
                </>
              )}

              {activeFeatureTab === "sprints" && (
                <>
                  <div className="inline-flex rounded-md bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Sprint Bottleneck Detection
                  </div>
                  <h3 className="text-xl font-bold text-text-primary sm:text-3xl">
                    Identify PR Bottlenecks Before They Delay Releases
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed sm:text-base">
                    Get automated alerts when pull requests stay open too long or code reviews get stuck in queue. Pulse routes PRs to available reviewers instantly.
                  </p>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Smart PR auto-assignment based on reviewer availability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Historical cycle time benchmarking and trends</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Slack & Teams instant notifications for blocking reviews</span>
                    </li>
                  </ul>
                </>
              )}

              {activeFeatureTab === "security" && (
                <>
                  <div className="inline-flex rounded-md bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Bank-Grade Credential Vault
                  </div>
                  <h3 className="text-xl font-bold text-text-primary sm:text-3xl">
                    Secure Project Credentials & Secret Rotation
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed sm:text-base">
                    Store environment secrets, API keys, and database credentials safely. Role-based access controls ensure team members only see what they need.
                  </p>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>AES-256 encrypted credential storage with access logs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Granular SuperAdmin & Lead Developer permissions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Automated secret expiration warnings & rotation</span>
                    </li>
                  </ul>
                </>
              )}

              {activeFeatureTab === "command" && (
                <>
                  <div className="inline-flex rounded-md bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Keyboard-First Design
                  </div>
                  <h3 className="text-xl font-bold text-text-primary sm:text-3xl">
                    Lightning Fast Command Palette Navigation
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed sm:text-base">
                    Never touch the mouse again. Press ⌘K anywhere in the platform to jump to any project, search clients, or trigger workflow actions in milliseconds.
                  </p>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Global ⌘K search across all projects, clients & team members</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Customizable hotkey shortcuts for power users</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Instant fuzzy search matching with zero latency</span>
                    </li>
                  </ul>
                </>
              )}

              <div>
                <Link
                  to="/login?mode=signup&plan=pro"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Explore all platform capabilities
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <PulseLogo size={24} />
                  <span className="text-sm font-bold text-text-primary">Pulse Analytics Engine</span>
                </div>
                <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-bg p-3 text-xs">
                  <span className="text-text-secondary">Pull Request Review Time</span>
                  <span className="font-bold text-text-primary">42 mins avg</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-bg p-3 text-xs">
                  <span className="text-text-secondary">Active Developer Flow Time</span>
                  <span className="font-bold text-text-primary">6.8 hrs / day</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-bg p-3 text-xs">
                  <span className="text-text-secondary">Sprint Goal Completion</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">96.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING & BILLING PLANS SECTION */}
      <section id="pricing" className="border-t border-border/60 bg-surface/50 px-4 py-16 sm:py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <Sparkles className="h-3.5 w-3.5" />
              Transparent Pricing • Instant Setup
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Simple, Predictable Plans for Every Team Size
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
              Start with a 14-day trial or upgrade anytime. All plans include full access to real-time flow analytics and developer security.
            </p>

            <div className="mt-8 inline-flex items-center justify-center gap-3 rounded-full border border-border bg-bg p-1.5 text-xs">
              <button
                type="button"
                onClick={() => setHomeBillingCycle("monthly")}
                className={`rounded-full px-4 py-1.5 font-semibold transition-all ${
                  homeBillingCycle === "monthly" ? "bg-brand-600 text-white shadow-xs" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setHomeBillingCycle("yearly")}
                className={`rounded-full px-4 py-1.5 font-semibold transition-all ${
                  homeBillingCycle === "yearly" ? "bg-brand-600 text-white shadow-xs" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Annual Billing <span className="ml-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-600 dark:text-amber-400">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Free Plan Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-text-primary">Free Tier</h3>
                <p className="mt-1 text-xs text-text-tertiary">Ideal for individual devs & small side projects</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-text-primary">$0</span>
                  <span className="ml-1 text-xs text-text-tertiary">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Up to 15 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Up to 30 active projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>30-day dashboard history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login?mode=signup&plan=free"
                className="mt-8 block w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-center text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan Card */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-brand-500 bg-surface p-6 sm:p-8 shadow-xl ring-1 ring-brand-500/30">
              <div className="absolute -top-3.5 right-6 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Pro Plan</h3>
                <p className="mt-1 text-xs text-text-tertiary">For growing engineering teams scaling fast</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-text-primary">
                    ${homeBillingCycle === "yearly" ? "23" : "29"}
                  </span>
                  <span className="ml-1 text-xs text-text-tertiary">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Up to 50 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited active projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>12-month dashboard history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Encrypted credential vault</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Priority email & Slack support</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login?mode=signup&plan=pro"
                className="mt-8 block w-full rounded-lg bg-brand-600 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-all"
              >
                Start 14-Day Free Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-text-primary">Enterprise Plan</h3>
                <p className="mt-1 text-xs text-text-tertiary">For large organizations requiring custom security & SLAs</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-text-primary">
                    ${homeBillingCycle === "yearly" ? "79" : "99"}
                  </span>
                  <span className="ml-1 text-xs text-text-tertiary">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited team members & projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Full historical data & custom analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>SSO, SAML & audit security logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>99.99% SLA & dedicated account manager</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login?mode=signup&plan=enterprise"
                className="mt-8 block w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-center text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
              >
                Upgrade to Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS SECTION */}
      <section id="reviews" className="border-t border-border/60 bg-surface/40 px-4 py-16 sm:py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Loved by Engineering Leaders Everywhere
            </h2>
            <p className="mt-3 text-sm text-text-secondary sm:text-base">
              See how tech leaders use Pulse to streamline workflows and deliver projects on schedule.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">"{rev.comment}"</p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-xs">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{rev.name}</h4>
                    <p className="text-xs text-text-tertiary">
                      {rev.role} • <span className="text-text-secondary">{rev.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARTNERS SECTION */}
      <section id="partners" className="px-4 py-16 sm:py-20 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Integrates Seamlessly With Your Tech Stack
            </h2>
            <p className="mt-3 text-sm text-text-secondary sm:text-base">
              Connect Pulse with your existing tools in under 2 minutes with zero code modifications required.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-4 sm:p-5 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-bg text-brand-600">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-text-primary">{p.name}</h3>
                <p className="mt-0.5 text-[11px] text-text-tertiary">{p.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden border-t border-border/60 bg-brand-600 px-4 py-14 text-white sm:px-6 lg:py-20 shadow-2xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Transform Your Team's Productivity?
          </h2>
          <p className="mt-4 text-sm opacity-90 sm:text-lg">
            Join thousands of developers and engineering leaders building faster with Pulse. Start your free 14-day trial today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/login?mode=signup&plan=pro"
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-md sm:text-base"
            >
              Start Free Trial Now
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-border bg-surface px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <PulseLogo size={28} />
            <p className="text-xs text-text-tertiary max-w-sm leading-relaxed">
              Pulse is the premier team productivity analytics platform built for high-velocity software engineering organizations.
            </p>
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} Pulse Technologies, Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Product</h4>
            <ul className="mt-3 space-y-2 text-xs text-text-secondary">
              <li><a href="#features" className="hover:text-text-primary">Flow Analytics</a></li>
              <li><a href="#features" className="hover:text-text-primary">Sprint Intelligence</a></li>
              <li><a href="#features" className="hover:text-text-primary">Command Center</a></li>
              <li><a href="#features" className="hover:text-text-primary">Security Vault</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Company</h4>
            <ul className="mt-3 space-y-2 text-xs text-text-secondary">
              <li><a href="#trust" className="hover:text-text-primary">About Us</a></li>
              <li><a href="#reviews" className="hover:text-text-primary">Customers</a></li>
              <li><a href="#partners" className="hover:text-text-primary">Integrations</a></li>
              <li><Link to="/login" className="hover:text-text-primary">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Resources</h4>
            <ul className="mt-3 space-y-2 text-xs text-text-secondary">
              <li><a href="#pricing" className="hover:text-text-primary">Pricing Plans</a></li>
              <li><a href="#features" className="hover:text-text-primary">Documentation</a></li>
              <li><a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary">Usability Principles</a></li>
              <li><Link to="/login" className="hover:text-text-primary">System Status</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
