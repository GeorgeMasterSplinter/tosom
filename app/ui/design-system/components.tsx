/**
 * ToSom Design System — Base-komponentar
 * 
 * Alle base-komponentar for premium UI
 * Core-definition: Ro, varm, moden
 */

"use client";

import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

/* ═════════════════════════════════════════
   Button
   ═════════════════════════════════════════ */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children?: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[12px] font-medium border-none cursor-pointer transition-all duration-[150ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-2";
  
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#D4AF37] text-[#0B0E11] shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:bg-[#E8C766] hover:-translate-y-[1px]",
    secondary:
      "bg-white/[0.04] text-white border border-white/10 backdrop-blur-[16px] hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-[1px]",
    ghost:
      "bg-transparent text-white/45 hover:text-white hover:bg-white/[0.04]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

/* ═════════════════════════════════════════
   Card
   ═════════════════════════════════════════ */

export type CardVariant = "glass" | "panel";

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export function Card({ variant = "glass", className = "", children, onClick }: CardProps) {
  const base =
    "rounded-[20px] transition-all duration-[250ms]";
  
  const variants: Record<CardVariant, string> = {
    glass:
      "bg-white/[0.04] border border-white/10 backdrop-blur-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:bg-white/[0.06] hover:border-white/20",
    panel:
      "bg-[#111418] border border-white/8 shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════
   Input
   ═════════════════════════════════════════ */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-white/60 font-medium">
          {label}
        </label>
      )}
      <input
        className={`bg-white/[0.04] border border-white/10 rounded-[12px] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] backdrop-blur-xl transition-all ${
          error ? "border-[#FF4D4D]" : ""
        } ${className}`.trim()}
        {...props}
      />
      {error && <span className="text-xs text-[#FF4D4D]">{error}</span>}
    </div>
  );
}

/* ═════════════════════════════════════════
   TextArea
   ═════════════════════════════════════════ */

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function TextArea({ label, error, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-white/60 font-medium">
          {label}
        </label>
      )}
      <textarea
        className={`bg-white/[0.04] border border-white/10 rounded-[12px] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] backdrop-blur-xl transition-all resize-none ${
          error ? "border-[#FF4D4D]" : ""
        } ${className}`.trim()}
        {...props}
      />
      {error && <span className="text-xs text-[#FF4D4D]">{error}</span>}
    </div>
  );
}

/* ═════════════════════════════════════════
   Heading
   ═════════════════════════════════════════ */

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children?: ReactNode;
  className?: string;
}

export function Heading({ level = 1, children, className = "" }: HeadingProps) {
  const sizes: Record<number, string> = {
    1: "text-[32px]",
    2: "text-[24px]",
    3: "text-[20px]",
    4: "text-[16px]",
  };

  const Tag = `h${level}` as const;
  
  return (
    <Tag className={`${sizes[level]} font-semibold leading-tight ${className}`}>
      {children}
    </Tag>
  );
}

/* ═════════════════════════════════════════
   Paragraph
   ═════════════════════════════════════════ */

export interface ParagraphProps {
  children?: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Paragraph({ children, className = "", muted = false }: ParagraphProps) {
  return (
    <p className={`text-[16px] font-normal leading-relaxed ${
      muted ? "text-white/45" : "text-white/65"
    } ${className}`}>
      {children}
    </p>
  );
}

/* ═════════════════════════════════════════
   Badge
   ═════════════════════════════════════════ */

export interface BadgeProps {
  children?: ReactNode;
  variant?: "gold" | "glass" | "success" | "error";
  className?: string;
}

export function Badge({ variant = "gold", children, className = "" }: BadgeProps) {
  const variants: Record<string, string> = {
    gold: "bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#D4AF37]",
    glass: "bg-white/[0.04] border border-white/10 text-white/70",
    success: "bg-[#4DFF88]/10 border border-[#4DFF88]/20 text-[#4DFF88]",
    error: "bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 text-[#FF4D4D]",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ═════════════════════════════════════════
   ProgressBar
   ═════════════════════════════════════════ */

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "gold" | "glass";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  variant = "gold",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const trackClasses =
    "h-2 bg-white/5 rounded-full overflow-hidden";
  
  const fillClasses =
    `h-full rounded-full transition-all duration-[350ms] ${
      variant === "gold"
        ? "bg-gradient-to-r from-[#D4AF37] to-[#E8C766]"
        : "bg-white/20"
    }`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-white/45">
          <span>{value} / {max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={trackClasses}>
        <div className={fillClasses} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════
   Divider
   ═════════════════════════════════════════ */

export interface DividerProps {
  className?: string;
  variant?: "line" | "glass";
}

export function Divider({ variant = "line", className = "" }: DividerProps) {
  const variants: Record<string, string> = {
    line: "border-t border-white/8",
    glass: "border-t border-white/4 bg-white/[0.02]",
  };

  return <hr className={`${variants[variant]} ${className}`} />;
}

/* ═════════════════════════════════════════
   IconButton
   ═════════════════════════════════════════ */

export interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  tooltip?: string;
  className?: string;
  href?: string;
}

export function IconButton({
  icon,
  onClick,
  size = "md",
  tooltip,
  className = "",
  href,
}: IconButtonProps) {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const base =
    "inline-flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all";
  
  const classes = `${base} ${sizes[size]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes} title={tooltip}>
        {icon}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} title={tooltip}>
      {icon}
    </button>
  );
}

/* ═════════════════════════════════════════
   PageContainer
   ═════════════════════════════════════════ */

export interface PageContainerProps {
  children?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageContainer({ children, className = "", centered = false }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-[#0B0E11] ${centered ? "flex items-center justify-center" : ""} ${className}`}>
      <div className={`${centered ? "w-full max-w-2xl" : "max-w-4xl"} mx-auto px-4 py-8`}>
        {children}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════
   Section
   ═════════════════════════════════════════ */

export interface SectionProps {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export function Section({ children, className = "", title }: SectionProps) {
  return (
    <section className={`py-8 ${className}`}>
      {title && <h2 className="text-[24px] font-semibold text-white mb-6">{title}</h2>}
      {children}
    </section>
  );
}

/* ═════════════════════════════════════════
   Stack (vertikal/horisontal layout)
   ═════════════════════════════════════════ */

export interface StackProps {
  children?: ReactNode;
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Stack({ children, direction = "vertical", gap = "md", className = "" }: StackProps) {
  const gaps: Record<string, string> = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={`${direction === "vertical" ? "flex flex-col" : "flex flex-row"} ${gaps[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════
   Grid
   ═════════════════════════════════════════ */

export interface GridProps {
  children?: ReactNode;
  cols?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Grid({ children, cols = 2, gap = "md", className = "" }: GridProps) {
  const colsClasses: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gaps: Record<string, string> = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={`${colsClasses[cols]} ${gaps[gap]} ${className}`}>
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════
   GlassPanel (stort glass-panel)
   ═════════════════════════════════════════ */

export interface GlassPanelProps {
  children?: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function GlassPanel({ children, className = "", padding = "lg" }: GlassPanelProps) {
  const paddings: Record<string, string> = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white/[0.04] border border-white/10 backdrop-blur-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-[20px] ${paddings[padding]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}