/**
 * @deprecated Byggt av ToSom-signaturen i `components/motion/Reveal.tsx` (S-9, LANDING-SIGNATUR-v1.0).
 * Reveal bruker IntersectionObserver + CSS (ingen framer-motion), og følger calm-motion (6 % bevegelse,
 * ease-out cubic, 80 ms stagger). Nye scroll-reveals skal bruke Reveal, ikke denne komponenten.
 *
 * ── Original (Warm Flow Animations v2026) 🟡⭐
 * Premium fade-in komponent med scroll-trigger, stagger og variantar.
 *
 * Pakke 6.5 — Warm Flow Animations (Steg 1)
 *
 * Variantar:
 * - fadeInUp — standard (0.5s ease-out)
 * - fadeIn — bare opacity (0.3s)
 * - slideUp — glir opp med cubic-bezier (0.4s)
 * - scaleIn — zoome inn (0.3s)
 * - fadeRight / fadeLeft — side-scroll (0.4s)
 * 
 * Features:
 * - Scroll-triggered via framer-motion's useInView (IntersectionObserver)
 * - Stagger: delay mellom element i children-array
 * - Restraints: prefers-reduced-motion støtta
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, MotionProps } from "framer-motion";

/* ═══════════════════════════════════════
   SYSTEM-INSTILLINGER — prefers-reduced-motion
   ═══════════════════════════════════════ */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/* ═══════════════════════════════════════
   ANIMATION VARIANTS — Roleg, nordisk, premium
   ═══════════════════════════════════════ */

const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
  },
  microFloat: {
    hidden: { y: 0 },
    visible: {
      y: [0, -3, 0],
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        repeatType: "reverse" as const,
        ease: "easeInOut" as const
      },
    },
  },
};

/* ═══════════════════════════════════════
   PROPS-TYPE — FadeInProps
   ═══════════════════════════════════════ */

export interface FadeInProps extends Omit<MotionProps, "animate" | "initial" | "variants"> {
  /** Animation variant: fadeInUp | fadeIn | slideUp | scaleIn | fadeRight | fadeLeft | microFloat */
  variant?: keyof typeof variants;
  /** Delay i millisekund før animasjon startar */
  delay?: number;
  /** Delay for children (stagger) — brukt når children er ein array */
  staggerChildren?: number;
  /** Om elementet skal animere bare når det er synleg i viewport */
  scrollTrigger?: boolean;
  /** Once-triggert: animér bare ein gong */
  once?: boolean;
  /** Animasjonstid i sekund (overskriver variant-standard) */
  duration?: number;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — FADEIN
   ═══════════════════════════════════════ */

export function FadeIn({
  variant = "fadeInUp",
  delay = 0,
  staggerChildren,
  scrollTrigger = false,
  once = true,
  duration,
  children,
  className = "",
  style,
  ...restProps
}: FadeInProps) {
  const ref = useRef(null);
  
  // Always use "0px" as margin for useInView — framer-motion MarginType requires specific template literal format
  const isInView = useInView(ref, { 
    margin: "0px", 
    once: once 
  });
  
  const reducedMotion = useReducedMotion();

  // Velg variant (standard eller custom)
  const variantName = variant || "fadeInUp";
  const baseVariant = variants[variantName] || variants.fadeInUp;

  // Konstruer animasjon-tilstand
  const animateState = reducedMotion || !scrollTrigger || isInView
    ? (baseVariant.visible || { opacity: 1 })
    : (baseVariant.hidden || { opacity: 0 });

  const initialState = baseVariant.hidden || { opacity: 0 };

  // Stagger for children
  const transitionConfig = duration !== undefined
    ? { ...baseVariant.visible?.transition, duration }
    : baseVariant.visible?.transition;

  if (Array.isArray(children)) {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        initial="hidden"
        animate={scrollTrigger && !reducedMotion ? animateState : "visible"}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerChildren || 0.1,
            },
          },
        }}
        {...restProps}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: initialState,
              visible: {
                ...(baseVariant.visible as object),
                transition: {
                  ...transitionConfig,
                  delay: delay + (staggerChildren || 0.1) * index,
                },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={scrollTrigger && !reducedMotion ? animateState : "visible"}
      variants={{
        visible: {
          transition: {
            ...transitionConfig,
            delay,
          },
        },
      }}
      {...restProps}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   PREBUILT VARIANTS — Ferdige komponentar
   ═══════════════════════════════════════ */

export function FadeInUp({ delay = 0, className, children, ...rest }: FadeInProps) {
  return (
    <FadeIn variant="fadeInUp" delay={delay} className={className} {...rest}>
      {children}
    </FadeIn>
  );
}

export function SlideUp({ delay = 0, className, children, ...rest }: FadeInProps) {
  return (
    <FadeIn variant="slideUp" delay={delay} className={className} {...rest}>
      {children}
    </FadeIn>
  );
}

export function ScaleIn({ delay = 0, className, children, ...rest }: FadeInProps) {
  return (
    <FadeIn variant="scaleIn" delay={delay} className={className} {...rest}>
      {children}
    </FadeIn>
  );
}

export function FadeRight({ delay = 0, className, children, ...rest }: FadeInProps) {
  return (
    <FadeIn variant="fadeRight" delay={delay} className={className} {...rest}>
      {children}
    </FadeIn>
  );
}

export function FadeLeft({ delay = 0, className, children, ...rest }: FadeInProps) {
  return (
    <FadeIn variant="fadeLeft" delay={delay} className={className} {...rest}>
      {children}
    </FadeIn>
  );
}

/**
 * StaggerContainer — wrapper for animerte barn med stagger-delay.
 * Bruk: <StaggerContainer><Child1 /><Child2 /><Child3 /></StaggerContainer>
 */
export function StaggerContainer({ 
  children, 
  stagger = 0.1, 
  delayFirst = 0 
}: { 
  children: React.ReactNode; 
  stagger?: number;
  delayFirst?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView && !reducedMotion ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delayFirst },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;