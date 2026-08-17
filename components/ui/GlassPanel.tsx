/**
 * Tosom — GlassPanel (Universal)
 * 
 * Gjenbrukbart glass-panel med Tosom Blue + Nordic Gold design.
 * Bruk på tvers av chat, dashboard, settings, admin og onboarding.
 */

import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  borderStyle?: "default" | "gold" | "none";
  glow?: boolean;
}

export default function GlassPanel({
  children,
  className = "",
  padding = "md",
  borderStyle = "default",
  glow = false,
}: GlassPanelProps) {
  const paddingMap = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const borderMap = {
    default: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      shadow: "0 8px 32px rgba(0,0,0,0.25)",
    },
    gold: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(212,175,55,0.2)",
      shadow: glow
        ? "0 8px 32px rgba(0,0,0,0.25), 0 0 24px rgba(212,175,55,0.1)"
        : "0 8px 32px rgba(0,0,0,0.25)",
    },
    none: {
      background: "rgba(255,255,255,0.02)",
      border: "none",
      shadow: glow ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
    },
  };

  const style = borderMap[borderStyle];

  return (
    <div
      className={`rounded-[20px] ${paddingMap[padding]} backdrop-blur-md transition-all duration-300 hover:scale-[1.005] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ─── GlassPanelHeader (helper) ─── */
export function GlassPanelHeader({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-1">
        {icon && <span className="text-xl">{icon}</span>}
        <h3
          className="text-base font-medium tracking-tight"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h3>
      </div>
      {description && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── GoldButton (gjenbrukbar) ─── */
export function GoldButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-5 py-3 font-medium rounded-[16px] transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] active:scale-[0.98] ${className}`}
      style={{
        background: disabled ? "rgba(212,175,55,0.2)" : "linear-gradient(135deg, #D4AF37, #E8C766)",
        color: disabled ? "rgba(255,255,255,0.3)" : "#0B1520",
        fontSize: "18px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}