/* ═══════════════════════════════════════════
   ToSom Premium — ProgressBar Component
   Props: value (0–100), color="gold"
   Smooth transition (300ms)
   ═══════════════════════════════════════════ */

interface ProgressBarProps {
  value: number;
  color?: "gold" | "white" | "success";
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const colorClasses: Record<string, string> = {
  gold: "bg-ts-gold",
  white: "bg-white",
  success: "bg-ts-success",
};

const heightClasses: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar = ({
  value,
  color = "gold",
  height = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-ts-muted">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full ${heightClasses[height]} bg-ts-surface`}
      >
        <div
          className={`${heightClasses[height]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;