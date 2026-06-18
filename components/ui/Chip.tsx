"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

export function Chip({ label, className, onClick }: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        // CSS variable-driven
        "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1.5",
        "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20",
        "backdrop-blur-sm cursor-pointer",
        "transition-all [var(--transition-fast)] hover:bg-gold/25 hover:scale-105",
        className
      )}
    >
      {label}
    </span>
  );
}
