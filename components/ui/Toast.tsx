"use client";

/* ═══════════════════════════════════════════
   Tosom Premium — Toast Component
   success, error, info, warning
   GPU-composited (opacity + transform only)
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════ */

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const typeConfig: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: "rgba(77, 255, 136, 0.1)",
    border: "rgba(77, 255, 136, 0.3)",
    icon: "✓",
  },
  error: {
    bg: "rgba(255, 77, 77, 0.1)",
    border: "rgba(255, 77, 77, 0.3)",
    icon: "✕",
  },
  info: {
    bg: "rgba(96, 165, 250, 0.1)",
    border: "rgba(96, 165, 250, 0.3)",
    icon: "ℹ",
  },
  warning: {
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.3)",
    icon: "⚠",
  },
};

export const Toast = ({ message, type = "info", duration = 4000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // SSR-safe reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent | any) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    if (!mq.addEventListener) mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.("change", handler);
      mq.removeListener?.(handler);
    };
  }, []);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = typeConfig[type];

  // GPU-composited: opacity + translateX/Y (no layout thrashing)
  const baseClasses = "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md border border-ts-gold/20 px-5 py-4 text-sm font-medium text-ts-primary shadow-lg";

  return (
    <div
      className={`${baseClasses} ${
        reducedMotion
          ? "opacity-100 translate-y-0"
          : "transition-[opacity,transform] duration-300 ease-out " + (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")
      }`}
      style={
        reducedMotion
          ? { background: config.bg }
          : {
              background: config.bg,
              transition: "opacity 300ms ease-out, transform 300ms ease-out",
            }
      }
      role="alert"
      aria-live="polite"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
        {config.icon}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
