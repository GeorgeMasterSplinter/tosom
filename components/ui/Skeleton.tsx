"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Skeleton & Shimmer Components
   Bruk ts-radius og ts-shadow tokens
   Shimmer gradient animasjon
   ═══════════════════════════════════════════ */

/* ── Skeleton ── */
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

const radiusMap: Record<"sm" | "md" | "lg" | "xl" | "full", string> = {
  sm: "var(--ts-radius-sm)",
  md: "var(--ts-radius-md)",
  lg: "var(--ts-radius-lg)",
  xl: "var(--ts-radius-xl)",
  full: "var(--ts-radius-full)",
};

export const Skeleton = ({ className = "", width, height, rounded = "md" }: SkeletonProps) => (
  <div
    className={`animate-pulse ${className}`}
    style={{
      width: width ?? "100%",
      height: height ?? "16px",
      borderRadius: radiusMap[rounded],
      background: "rgba(255, 255, 255, 0.06)",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
    }}
  />
);

/* ── Shimmer ── */
interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
  animated?: boolean;
}

export const Shimmer = ({
  className = "",
  width,
  height,
  animated = true,
}: ShimmerProps) => (
  <div
    className={className}
    style={{
      width: width ?? "100%",
      height: height ?? "200px",
      borderRadius: "var(--ts-radius-lg)",
      background: animated
        ? "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)"
        : "rgba(255, 255, 255, 0.04)",
      backgroundSize: animated ? "200% 100%" : "100% 100%",
      animation: animated ? "shimmer 1.5s infinite linear" : "none",
    }}
  />
);

// Shimmer animation keyframes
if (typeof window !== "undefined") {
  const styleId = "tosom-shimmer-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default Skeleton;
