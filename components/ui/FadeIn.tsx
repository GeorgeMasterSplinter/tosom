/* ═══════════════════════════════════════════
   ToSom Premium — FadeIn Animation Component
   Smooth mount transitions (250ms max)
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  threshold?: number;
  once?: boolean;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 250,
  direction = "up",
  threshold = 0.1,
  once = true,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const transforms: Record<string, string> = {
    up: "translateY(12px)",
    down: "translateY(-12px)",
    left: "translateX(12px)",
    right: "translateX(-12px)",
    scale: "scale(0.96)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════
   FadeInUp — quick helper
   ═══════════════════════════════════════════ */

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = 0, className = "" }) => (
  <FadeIn delay={delay} direction="up" duration={250} className={className}>
    {children}
  </FadeIn>
);

/* ═══════════════════════════════════════════
   FadeInScale — quick helper
   ═══════════════════════════════════════════ */

interface FadeInScaleProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInScale: React.FC<FadeInScaleProps> = ({ children, delay = 0, className = "" }) => (
  <FadeIn delay={delay} direction="scale" duration={250} className={className}>
    {children}
  </FadeIn>
);

/* ═══════════════════════════════════════════
   Default export
   ═══════════════════════════════════════════ */

export default FadeIn;