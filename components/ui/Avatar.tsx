/* ═══════════════════════════════════════════
   Tosom Premium — Avatar Component
   Props: src, fallback, size, status
   Gold-border for premium variant
   ═══════════════════════════════════════════ */

import Image from "next/image";
import React from "react";

interface AvatarProps {
  src?: string;
  fallback?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  className?: string;
  priority?: boolean;
}

const sizeMap: Record<"sm" | "md" | "lg" | "xl", { dim: string; font: string; width: number; height: number }> = {
  sm: { dim: "h-8 w-8 text-xs", font: "text-xs", width: 32, height: 32 },
  md: { dim: "h-10 w-10 text-sm", font: "text-sm", width: 40, height: 40 },
  lg: { dim: "h-12 w-12 text-base", font: "text-base", width: 48, height: 48 },
  xl: { dim: "h-16 w-16 text-lg", font: "text-lg", width: 64, height: 64 },
};

const statusColors: Record<"online" | "offline" | "away" | "busy", string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-500",
  away: "bg-amber-500",
  busy: "bg-red-500",
};

export const Avatar = ({
  src,
  fallback,
  alt = "",
  size = "md",
  status,
  className = "",
  priority = false,
}: AvatarProps) => {
  const fb = fallback || "?";
  const s = sizeMap[size];

  return (
    <div className={`relative inline-flex ${s.dim} ${className}`}>
      {/* Avatar circle */}
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2"
        style={{
          borderColor: src ? "var(--ts-gold)" : "rgba(255, 255, 255, 0.12)",
          background: src ? "transparent" : "rgba(255, 255, 255, 0.06)",
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || `Avatar for ${fallback}`}
            width={s.width}
            height={s.height}
            className="h-full w-full object-cover"
            priority={priority}
            style={{ borderRadius: "9999px" } as React.CSSProperties}
          />
        ) : (
          <span
            className={`font-semibold uppercase leading-none`}
            style={{ color: "var(--ts-gold)" }}
            aria-label={alt || `Ingen profilbilde`}
          >
            {fb.charAt(0)}
          </span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 ${statusColors[status]}`}
          style={{ borderColor: "var(--ts-bg-primary)" }}
        />
      )}
    </div>
  );
};

export default Avatar;
