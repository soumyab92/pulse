import { KeyboardEvent, useRef, useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Add tag…" }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ id: string; name: string }[]>("/tags");
      return data;
    },
  });

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (draft) addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const suggestions = (allTags ?? [])
    .map((t) => t.name)
    .filter((name) => !value.includes(name) && (draft ? name.includes(draft.toLowerCase()) : true))
    .slice(0, 6);

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/40"
      >
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-md bg-bg py-0.5 pl-2 pr-1 text-xs font-medium text-text-secondary">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
              <X className="h-3 w-3 hover:text-text-primary" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
      </div>
      {focused && suggestions.length > 0 && (
        <div className="glass-raised absolute z-20 mt-1.5 w-full animate-scale-in rounded-lg p-1">
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(name);
              }}
              className="block w-full rounded-md px-2.5 py-1.5 text-left text-sm text-text-primary hover:bg-bg"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
