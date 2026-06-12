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
        "inline-flex items-center rounded-full px-3 py-1.5",
        "bg-gold-soft text-gold border border-gold-border",
        "backdrop-blur-sm cursor-pointer",
        "transition-all duration-200 hover:bg-gold/25 hover:scale-105",
        className
      )}
    >
      {label}
    </span>
  );
}
