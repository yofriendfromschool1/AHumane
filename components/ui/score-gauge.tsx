import { cn } from "@/lib/utils/cn";

export function ScoreGauge({
  value,
  label,
  sublabel,
  size = 168,
  tone,
  className,
}: {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
  tone?: "auto" | "rose" | "amber" | "emerald" | "blue";
  className?: string;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  const resolvedTone =
    tone && tone !== "auto"
      ? tone
      : value >= 65
        ? "rose"
        : value >= 45
          ? "amber"
          : "emerald";
  const color =
    resolvedTone === "rose"
      ? "#f43f5e"
      : resolvedTone === "amber"
        ? "#f59e0b"
        : resolvedTone === "blue"
          ? "#2563eb"
          : "#10b981";
  const soft =
    resolvedTone === "rose"
      ? "#fff1f2"
      : resolvedTone === "amber"
        ? "#fffbeb"
        : resolvedTone === "blue"
          ? "#eff6ff"
          : "#ecfdf5";

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={soft} strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 700ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tracking-tight tabular-nums text-neutral-900">
            {Math.round(value)}%
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            {label}
          </span>
        </div>
      </div>
      {sublabel ? <p className="mt-2 max-w-[220px] text-center text-xs text-neutral-500">{sublabel}</p> : null}
    </div>
  );
}
