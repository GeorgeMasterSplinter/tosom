"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

export function Avatar({ src, alt, size = "md", fallback, className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  return (
    <div
      className={cn(
        // CSS variable-driven
        "shrink-0 rounded-[var(--radius-full)] ring-1 ring-[var(--glass-border)] flex items-center justify-center transition-all [var(--transition-fast)] ease-out",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-[var(--radius-full)] object-cover"
          loading="lazy"
        />
      ) : (
        <span
          className="font-medium"
          style={{ color: "var(--color-text)" }}
        >
          {fallback || alt?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
