import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ClipboardList,
  FolderKanban,
  FolderPlus,
  KeyRound,
  LayoutDashboard,
  Search,
  Sparkles,
  UserCircle,
  UsersRound,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { useHotkey } from "@/hooks/useHotkey";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { apiClient } from "@/lib/apiClient";
import { isSuperAdmin } from "@/lib/auth";
import type { Client, Paginated, Project } from "@/types/api";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  sublabel?: string;
  icon: typeof LayoutDashboard;
  onSelect: () => void;
  group: string;
}

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const openPalette = useUiStore((s) => s.openCommandPalette);
  const close = useUiStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 250);

  useHotkey("k", () => openPalette(), { meta: true });

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const { data: projectResults } = useQuery({
    queryKey: ["command-palette-projects", debouncedQuery],
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<Project>>("/projects", {
        params: { q: debouncedQuery, pageSize: 5 },
      });
      return data.items;
    },
    enabled: open && debouncedQuery.length > 0,
  });

  const { data: clientResults } = useQuery({
    queryKey: ["command-palette-clients", debouncedQuery],
    queryFn: async () => {
      const { data } = await apiClient.get<Client[]>("/clients", { params: { q: debouncedQuery } });
      return data.slice(0, 5);
    },
    enabled: open && debouncedQuery.length > 0,
  });

  const navCommands: Command[] = useMemo(
    () => [
      { id: "nav-dashboard", label: "Go to Dashboard", icon: LayoutDashboard, group: "Navigate", onSelect: () => navigate("/dashboard") },
      { id: "nav-clients", label: "Go to Clients", icon: Building2, group: "Navigate", onSelect: () => navigate("/clients") },
      { id: "nav-projects", label: "Go to Projects", icon: FolderKanban, group: "Navigate", onSelect: () => navigate("/projects") },
      { id: "nav-my-projects", label: "Go to My Projects", icon: ClipboardList, group: "Navigate", onSelect: () => navigate("/my-projects") },
      { id: "nav-credentials", label: "Go to Credentials", icon: KeyRound, group: "Navigate", onSelect: () => navigate("/credentials") },
      ...(isSuperAdmin(user)
        ? [
            { id: "nav-user-control", label: "Go to User Control", icon: UsersRound, group: "Navigate", onSelect: () => navigate("/admin/users") },
            { id: "nav-billing", label: "Go to Upgrade", icon: Sparkles, group: "Navigate", onSelect: () => navigate("/billing") },
          ]
        : []),
      { id: "nav-profile", label: "Go to Profile", icon: UserCircle, group: "Navigate", onSelect: () => navigate("/profile") },
      { id: "action-new-project", label: "Create New Project", icon: FolderPlus, group: "Actions", onSelect: () => navigate("/projects/new") },
    ],
    [navigate, user],
  );

  const filteredNav = navCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const projectCommands: Command[] = (projectResults ?? []).map((p) => ({
    id: `project-${p.id}`,
    label: p.title,
    sublabel: p.client?.name,
    icon: FolderKanban,
    group: "Projects",
    onSelect: () => navigate(`/projects?highlight=${p.id}`),
  }));

  const clientCommands: Command[] = (clientResults ?? []).map((c) => ({
    id: `client-${c.id}`,
    label: c.name,
    sublabel: c.company ?? undefined,
    icon: Building2,
    group: "Clients",
    onSelect: () => navigate("/clients"),
  }));

  const allCommands = query.length > 0 ? [...filteredNav, ...projectCommands, ...clientCommands] : navCommands;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = allCommands[activeIndex];
        if (cmd) {
          cmd.onSelect();
          close();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, allCommands, activeIndex, close]);

  let groupCursor = "";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass-raised relative z-10 w-full max-w-lg overflow-hidden rounded-lg"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or jump to…"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">Esc</kbd>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {allCommands.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-text-tertiary">No results found</p>
              )}
              {allCommands.map((cmd, idx) => {
                const showGroupHeader = cmd.group !== groupCursor;
                groupCursor = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroupHeader && (
                      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        cmd.onSelect();
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors duration-100",
                        idx === activeIndex ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300" : "text-text-primary",
                      )}
                    >
                      <cmd.icon className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                      <span className="truncate">{cmd.label}</span>
                      {cmd.sublabel && <span className="ml-auto truncate text-xs text-text-tertiary">{cmd.sublabel}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
