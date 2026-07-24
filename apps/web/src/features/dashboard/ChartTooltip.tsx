import { useChartColors } from "@/lib/chartTheme";

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { value: number | string; name: string; color?: string }[];
  formatter?: (value: number | string, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
}

export function ChartTooltip({ active, label, payload, formatter, labelFormatter }: ChartTooltipProps) {
  const colors = useChartColors();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-md"
      style={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder }}
    >
      {label && <p className="mb-1 font-medium text-text-primary">{labelFormatter ? labelFormatter(label) : label}</p>}
      <div className="space-y-0.5">
        {payload.map((entry, idx) => {
          const [value, name] = formatter ? formatter(entry.value, entry.name) : [String(entry.value), entry.name];
          return (
            <div key={idx} className="flex items-center gap-2">
              {entry.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />}
              <span className="text-text-tertiary">{name}:</span>
              <span className="font-medium text-text-primary">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
