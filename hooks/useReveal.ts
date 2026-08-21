'use client';

/**
 * Tosom — useReveal
 *
 * Scroll-utløst synlighet via IntersectionObserver.
 * Utløses én gang, deretter kobles observatøren fra.
 */

import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  /** Andel av elementet som må være synlig. 0–1. */
  threshold?: number;
  /** Marg rundt viewport. Negativ bunn utløser før elementet er helt inne. */
  rootMargin?: string;
  /** Utløs kun første gang. */
  once?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Uten IntersectionObserver: vis alt umiddelbart.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

export default useReveal;