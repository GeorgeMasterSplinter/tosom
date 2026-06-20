"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Toast Component
   success, error, info, warning
   Gold-accent for success
   Fade-in/out animasjoner
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

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = typeConfig[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md border border-gold/20 px-5 py-4 text-sm font-medium text-ts-primary shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{
        background: config.bg,
        borderColor: config.border,
      }}
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
