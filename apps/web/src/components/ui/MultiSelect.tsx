import { useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

export interface MultiSelectOption {
  id: string;
  label: string;
  sublabel?: string;
  avatarUrl?: string | null;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "Select…" }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const selected = options.filter((o) => value.includes(o.id));
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-left text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
      >
        {selected.length === 0 && <span className="text-text-tertiary">{placeholder}</span>}
        {selected.map((o) => (
          <span
            key={o.id}
            className="flex items-center gap-1.5 rounded-md bg-bg py-0.5 pl-1 pr-1.5 text-xs font-medium text-text-secondary"
          >
            <Avatar name={o.label} src={o.avatarUrl} size="xs" />
            {o.label}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                toggle(o.id);
              }}
              className="rounded-sm hover:text-text-primary"
              aria-label={`Remove ${o.label}`}
            >
              <X className="h-3 w-3" />
            </span>
          </span>
        ))}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-text-tertiary" />
      </button>

      {open && (
        <div className="glass-raised absolute z-20 mt-1.5 w-full animate-scale-in rounded-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3.5 w-3.5 text-text-tertiary" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && <p className="px-3 py-4 text-center text-sm text-text-tertiary">No matches</p>}
            {filtered.map((o) => {
              const isSelected = value.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-text-primary transition-colors duration-100 hover:bg-bg"
                >
                  <Avatar name={o.label} src={o.avatarUrl} size="xs" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{o.label}</span>
                    {o.sublabel && <span className="block truncate text-xs text-text-tertiary">{o.sublabel}</span>}
                  </span>
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-border-strong",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
