// components/ui/SlideUp.tsx — Animerer fra botn med spring-easing
'use client';

import { useState, useEffect, useRef } from 'react';

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  spring?: boolean;
  className?: string;
}

export function SlideUp({ children, delay = 0, duration = 350, spring = false, className = '' }: SlideUpProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Stagger children
  const childArray = [children] as React.ReactNode[];
  const isMultiple = Array.isArray(children) && (children as React.ReactNode[]).length > 1;

  return (
    <div
      ref={ref}
      className={`ts-slide-up ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible 
          ? 'translateY(0)' 
          : 'translateY(24px)',
        transition: `opacity ${duration}ms ${delay}ms ${spring ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'}, transform ${duration}ms ${delay}ms ${spring ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'}`,
        willChange: visible ? undefined : 'opacity, transform',
      }}
    >
      {isMultiple
        ? (children as React.ReactNode[]).map((child, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible 
                  ? 'translateY(0)' 
                  : 'translateY(16px)',
                transitionDelay: `${delay + (spring ? i * 80 : i * 50)}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

// Helper-komponentar med spring-animasjon
export const SlideUpFast = ({ children, delay = 0, className = '' }: SlideUpProps) => (
  <SlideUp delay={delay} duration={250} spring={true} className={className}>
    {children}
  </SlideUp>
);

export const SlideUpNormal = ({ children, delay = 0, className = '' }: SlideUpProps) => (
  <SlideUp delay={delay} duration={350} spring={false} className={className}>
    {children}
  </SlideUp>
);

export default SlideUp;