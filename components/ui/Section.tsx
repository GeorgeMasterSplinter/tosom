"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Section Component
   Wrapper med fade-in via IntersectionObserver
   ═══════════════════════════════════════════ */

import { ReactNode, useEffect, useRef, useState } from "react";

export interface SectionProps {
  children: ReactNode;
  centered?: boolean;
  fadeIn?: boolean;
  maxWidth?: "default" | "xl" | "full";
  className?: string;
}

const maxWidthMap = {
  default: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export const Section = ({
  children,
  centered = true,
  fadeIn = true,
  maxWidth = "default",
  className = "",
}: SectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fadeIn) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fadeIn]);

  return (
    <section
      ref={ref}
      className={`
        mx-auto px-6 md:px-8 py-16 md:py-24
        ${centered ? "text-center" : ""}
        ${maxWidthMap[maxWidth]}
        ${fadeIn && !visible ? "opacity-0 translate-y-6" : fadeIn ? "opacity-100 translate-y-0" : ""}
        ${fadeIn ? "transition-all duration-[var(--ts-transition-slow)] ease-out" : ""}
        ${className}
      `.trim()}
    >
      {children}
    </section>
  );
};

export default Section;

/* ═══════════════════════════════════════════
   SectionHeader — hero-section med badge/title/subtitle
   ═══════════════════════════════════════════ */

export interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  badgeColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  badgeColor = "var(--ts-gold)",
  titleColor = "text-white",
  subtitleColor = "text-white/50",
  centered = true,
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`mb-10 md:mb-14 ${centered ? "text-center" : ""} ${className}`}>
      <span
        className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-4 border"
        style={{
          background: `${badgeColor}15`,
          color: badgeColor,
          borderColor: `${badgeColor}30`,
        }}
      >
        {badge}
      </span>
      <h1 className={`text-title-l md:text-title-xl font-semibold ${titleColor} mb-3`}>
        {title}
      </h1>
      <p className={`text-body ${subtitleColor}`}>
        {subtitle}
      </p>
    </div>
  );
};
