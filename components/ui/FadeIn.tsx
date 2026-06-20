/* ═══════════════════════════════════════════
   ToSom Premium — FadeIn Animation Component
   GPU-composited transitions (transform + opacity only)
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // Ref to store observer for unobserve
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoized observer callback to prevent re-creation
  const handleIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting && once) {
        observerRef.current?.unobserve(ref.current!);
      } else if (!entry.isIntersecting && !once) {
        setVisible(false);
      }
    },
    [once]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => handleIntersect(entry),
      { threshold, rootMargin: "0px" }
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [threshold, handleIntersect]);

  // GPU-composited: only transform + opacity animated
  return (
    <div
      ref={ref}
      className={`ts-fade-in-wrapper ${className}`}
      style={
        reducedMotion
          ? { opacity: 1 } // instantly visible, no animation
          : {
              opacity: visible ? 1 : 0,
              transform: visible
                ? "none"
                : ({
                    up: "translateY(12px)",
                    down: "translateY(-12px)",
                    left: "translateX(12px)",
                    right: "translateX(-12px)",
                    scale: "scale(0.96)",
                  }[direction]),
              transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
              willChange: visible ? undefined : "opacity, transform",
            }
      }
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