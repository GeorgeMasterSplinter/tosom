/* ═══════════════════════════════════════════
   Tosom Premium — Input Component
   Text, Email, Password, Textarea, Select
   ═══════════════════════════════════════════ */

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

/* ── Text Input ── */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", type = "text", ...props }, ref) => {
    const base =
      "w-full bg-[var(--ts-glass-bg)] border border-[var(--ts-border)] text-[var(--ts-text-primary)] " +
      "rounded-[var(--ts-radius-md)] px-4 py-3 text-base " +
      "placeholder-[var(--ts-text-subtle)] " +
      "transition-all duration-[var(--ts-transition-fast)] " +
      "focus:border-[var(--ts-gold)] focus:outline-none focus:ring-0 " +
      "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] focus:bg-[var(--ts-glass-bg-hover)]";

    return (
      <input ref={ref} type={type} className={`${base} ${className}`.trim()} {...props} />
    );
  }
);

Input.displayName = "Input";

/* ── Textarea ── */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => {
    const base =
      "w-full bg-[var(--ts-glass-bg)] border border-[var(--ts-border)] text-[var(--ts-text-primary)] " +
      "rounded-[var(--ts-radius-md)] px-4 py-3 text-base " +
      "placeholder-[var(--ts-text-subtle)] resize-y " +
      "transition-all duration-[var(--ts-transition-fast)] " +
      "focus:border-[var(--ts-gold)] focus:outline-none focus:ring-0 " +
      "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] focus:bg-[var(--ts-glass-bg-hover)]";

    return (
      <textarea ref={ref} className={`${base} ${className}`.trim()} {...props} />
    );
  }
);

Textarea.displayName = "Textarea";

/* ── Select ── */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", ...props }, ref) => {
    const base =
      "w-full bg-[var(--ts-glass-bg)] border border-[var(--ts-border)] text-[var(--ts-text-primary)] " +
      "rounded-[var(--ts-radius-md)] px-4 py-3 text-base " +
      "appearance-none cursor-pointer " +
      "transition-all duration-[var(--ts-transition-fast)] " +
      "focus:border-[var(--ts-gold)] focus:outline-none focus:ring-0 " +
      "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] focus:bg-[var(--ts-glass-bg-hover)]";

    return (
      <select ref={ref} className={`${base} ${className}`.trim()} {...props} />
    );
  }
);

Select.displayName = "Select";

/* ── Default export ── */
export default Input;
