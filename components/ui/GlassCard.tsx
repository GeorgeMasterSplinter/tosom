import React from "react";
import clsx from "clsx";

export default function GlassCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={clsx(
        // Base — Tailwind token classes from globals.css
        "ts-glass ts-spacing-lg gap-section",
        // Hover
        "hover:border-ts-gold/20",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
