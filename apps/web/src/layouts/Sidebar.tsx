import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navConfig";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { isSuperAdmin } from "@/lib/auth";
import { RoleBadge } from "@/components/ui/Badge";
import { PulseLogo } from "@/components/ui/PulseLogo";

interface SidebarProps {
  onSignOut: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin(user));

  return (
    <>
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 dark:bg-black/60 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "glass fixed inset-y-0 left-0 z-50 flex w-64 flex-col rounded-none border-y-0 border-l-0 transition-transform duration-200 md:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border/60 px-5">
          <PulseLogo size={26} />
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Primary">
          {visibleItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-text-secondary hover:bg-bg hover:text-text-primary",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-md bg-brand-50 dark:bg-brand-900/20"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          {user && (
            <div className="mb-2 flex items-center gap-2.5 rounded-md px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg text-xs font-semibold text-text-secondary ring-1 ring-border">
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
                <p className="truncate text-xs text-text-tertiary">{user.jobTitle ?? user.role}</p>
              </div>
              {isSuperAdmin(user) && <RoleBadge role={user.role} />}
            </div>
          )}
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700 dark:hover:bg-danger-500/10 dark:hover:text-danger-500"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
