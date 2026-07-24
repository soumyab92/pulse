import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserCircle } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { useActivityFeed } from "@/lib/queries/activity";
import { useClickOutside } from "@/hooks/useClickOutside";
import { formatRelativeTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSignOut: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  const navigate = useNavigate();
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);
  const openCommandPalette = useUiStore((s) => s.openCommandPalette);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const user = useAuthStore((s) => s.user);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  const { data: activity } = useActivityFeed(5);

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 rounded-none border-x-0 border-t-0 px-4 sm:px-6">
      <button
        className="rounded-md p-2 text-text-secondary hover:bg-bg md:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1 sm:max-w-sm">
        <button
          onClick={openCommandPalette}
          className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-bg px-3 text-sm text-text-tertiary transition-colors duration-150 hover:border-border-strong"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search projects, clients…</span>
          <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary sm:block">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-bg hover:text-text-primary"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-bg hover:text-text-primary"
          >
            <Bell className="h-4 w-4" />
          </button>
          {notifOpen && (
            <div
              role="menu"
              className="glass-raised absolute right-0 mt-2 w-80 animate-scale-in rounded-lg"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-text-primary">Recent activity</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {activity && activity.length > 0 ? (
                  activity.map((event) => (
                    <div key={event.id} className="border-b border-border px-4 py-3 last:border-b-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{event.user?.name ?? "Someone"}</span>{" "}
                        <span className="text-text-secondary">{event.message}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-text-tertiary">{formatRelativeTime(event.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-text-tertiary">No recent activity</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 transition-colors duration-150 hover:bg-bg"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bg text-xs font-semibold text-text-secondary ring-1 ring-border">
              {user?.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 text-text-tertiary transition-transform", profileOpen && "rotate-180")} />
          </button>
          {profileOpen && (
            <div
              role="menu"
              className="glass-raised absolute right-0 mt-2 w-56 animate-scale-in rounded-lg py-1.5"
            >
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="truncate text-xs text-text-tertiary">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg hover:text-text-primary"
              >
                <UserCircle className="h-4 w-4" />
                View profile
              </button>
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700 dark:hover:bg-danger-500/10 dark:hover:text-danger-500"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
