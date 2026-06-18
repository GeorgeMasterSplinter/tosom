import React from "react";
import clsx from "clsx";

export default function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        // Base — CSS variable-driven
        "rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass-bg)]",
        "backdrop-blur-[calc(var(--glass-blur)_+_8px)] shadow-[var(--shadow-lg)]",
        "p-[var(--space-xl)] md:p-[var(--space-3xl)] transition-all [var(--transition-normal)] ease-out",
        // Hover
        "hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-lg)] hover:bg-[var(--glass-bg-hover)]",
        className
      )}
    >
      {children}
    </div>
  );
}
