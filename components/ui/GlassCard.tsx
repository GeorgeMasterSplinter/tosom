import React from "react";
import clsx from "clsx";

export default function GlassCard({
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
        "rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)]",
        "backdrop-blur-[var(--glass-blur)] shadow-[var(--shadow-md)]",
        "p-[var(--space-lg)] gap-[var(--space-sm)] transition-all [var(--transition-normal)] ease-out",
        // Hover
        "hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-lg)] hover:bg-[var(--glass-bg-hover)]",
        className
      )}
    >
      {children}
    </div>
  );
}
