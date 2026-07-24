import { getInitials, cn } from "@/lib/utils";

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  slate: "bg-bg text-text-secondary",
  emerald: "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-500",
  amber: "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-500",
  rose: "bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-500",
  indigo: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200",
  teal: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
};

function colorForName(name: string) {
  const colors = Object.keys(COLOR_CLASSES);
  const idx = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const SIZE_CLASSES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
};

export function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover ring-1 ring-border", SIZE_CLASSES[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold ring-1 ring-border",
        SIZE_CLASSES[size],
        COLOR_CLASSES[colorForName(name)],
        className,
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

export function AvatarStack({ people, max = 4 }: { people: { id: string; name: string; avatarUrl?: string | null }[]; max?: number }) {
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((p) => (
        <Avatar key={p.id} name={p.name} src={p.avatarUrl} size="xs" className="ring-2 ring-surface" />
      ))}
      {overflow > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg text-[10px] font-semibold text-text-secondary ring-2 ring-surface">
          +{overflow}
        </div>
      )}
    </div>
  );
}
