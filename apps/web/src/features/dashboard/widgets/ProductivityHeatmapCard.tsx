import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUiStore } from "@/stores/uiStore";
import { sequentialColorForScore } from "@/lib/chartTheme";
import { useProductivityHeatmap } from "../api";

export function ProductivityHeatmapCard() {
  const { data, isLoading } = useProductivityHeatmap(8);
  const theme = useUiStore((s) => s.theme);
  const [hovered, setHovered] = useState<{ day: string; week: string; value: number | null } | null>(null);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Weekly Productivity Heatmap</CardTitle>
          <CardDescription>Average focus score by day, last 8 weeks</CardDescription>
        </div>
        {hovered && (
          <p className="text-xs text-text-tertiary">
            <span className="font-medium text-text-primary">{hovered.day}, {hovered.week}</span>
            {": "}
            {hovered.value != null ? `${hovered.value} focus score` : "No data"}
          </p>
        )}
      </CardHeader>
      <div className="overflow-x-auto p-5 pt-4">
        {isLoading || !data ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <div className="inline-block min-w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `32px repeat(${data.weekLabels.length}, minmax(28px, 1fr))` }}>
              <div />
              {data.weekLabels.map((label, i) => (
                <div key={i} className="truncate text-center text-[10px] text-text-tertiary">
                  {i % 2 === 0 ? label : ""}
                </div>
              ))}
              {data.rows.map((row) => (
                <FragmentRow key={row.day} day={row.day} values={row.values} weekLabels={data.weekLabels} theme={theme} onHover={setHovered} />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-text-tertiary">
              <span>Less</span>
              {[10, 35, 60, 80, 95].map((score) => (
                <span key={score} className="h-3 w-3 rounded-sm" style={{ backgroundColor: sequentialColorForScore(score, theme) }} />
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function FragmentRow({
  day,
  values,
  weekLabels,
  theme,
  onHover,
}: {
  day: string;
  values: (number | null)[];
  weekLabels: string[];
  theme: "light" | "dark";
  onHover: (v: { day: string; week: string; value: number | null } | null) => void;
}) {
  return (
    <>
      <div className="flex items-center text-[11px] text-text-tertiary">{day}</div>
      {values.map((value, i) => (
        <button
          key={i}
          onMouseEnter={() => onHover({ day, week: weekLabels[i], value })}
          onMouseLeave={() => onHover(null)}
          className="aspect-square rounded-sm transition-transform duration-100 hover:scale-110"
          style={{ backgroundColor: sequentialColorForScore(value, theme) }}
          aria-label={`${day}, ${weekLabels[i]}: ${value != null ? `${value} focus score` : "no data"}`}
        />
      ))}
    </>
  );
}
