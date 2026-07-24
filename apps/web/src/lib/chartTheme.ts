import { useUiStore } from "@/stores/uiStore";

// Status hues validated with the dataviz palette validator (CVD + contrast) for both
// light and dark chart surfaces. "neutral" is an intentional desaturated slot (a status
// meaning "inactive"), always paired with a visible label/legend per the validator's
// mitigation rule for its chroma-floor and 6-8 band CVD warnings.
const STATUS_COLORS = {
  light: { neutral: "#64748b", blue: "#2563eb", amber: "#f59e0b", green: "#10b981", red: "#ef4444" },
  dark: { neutral: "#94a3b8", blue: "#3b82f6", amber: "#d97706", green: "#059669", red: "#ef4444" },
};

const SEQUENTIAL_BLUE = {
  light: ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"],
  dark: ["#1e3a5f", "#1e40af", "#2563eb", "#60a5fa", "#93c5fd"],
};

export function useChartColors() {
  const theme = useUiStore((s) => s.theme);
  const palette = STATUS_COLORS[theme];

  return {
    theme,
    status: palette,
    projectStatus: {
      not_started: palette.neutral,
      in_progress: palette.blue,
      in_review: palette.amber,
      completed: palette.green,
      blocked: palette.red,
    } as Record<string, string>,
    attendanceStatus: {
      present: palette.green,
      remote: palette.blue,
      late: palette.amber,
      absent: palette.red,
      leave: palette.neutral,
    } as Record<string, string>,
    grid: theme === "dark" ? "#272d3d" : "#e4e7eb",
    axis: theme === "dark" ? "#64748b" : "#94a3b8",
    tooltipBg: theme === "dark" ? "#171c28" : "#ffffff",
    tooltipBorder: theme === "dark" ? "#272d3d" : "#e4e7eb",
    text: theme === "dark" ? "#94a3b8" : "#64748b",
    sequential: SEQUENTIAL_BLUE[theme],
    brand: theme === "dark" ? "#3b82f6" : "#2563eb",
  };
}

export function sequentialColorForScore(score: number | null, theme: "light" | "dark") {
  if (score == null) return theme === "dark" ? "#1a1f2e" : "#f4f5f7";
  const steps = SEQUENTIAL_BLUE[theme];
  const idx = Math.min(steps.length - 1, Math.floor((score / 100) * steps.length));
  return steps[idx];
}
