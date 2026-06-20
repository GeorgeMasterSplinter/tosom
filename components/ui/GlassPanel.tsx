import React from "react";
import clsx from "clsx";

export default function GlassPanel({
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
        "ts-glass-strong ts-spacing-xl md:ts-spacing-3xl",
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
