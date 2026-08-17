/**
 * Tosom — useChatScroll Hook
 * Optimalisert scroll-handtering for chat.
 * 
 * Funksjonar:
 * - scrollToBottom() — glir til botnen
 * - smoothScroll — myk scrolling
 * - autoScroll på ny melding
 * - scrollOnSystemMessage — prioritere systemmeldingar
 */

import { useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

export interface ChatScrollResult {
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: (options?: { behavior?: ScrollBehavior }) => void;
  smoothScrollToBottom: () => void;
  isAtBottom: () => boolean;
}

/* ═══════════════════════════════════════
   HOOK — useChatScroll
   ═══════════════════════════════════════ */

export function useChatScroll(dependency?: unknown): ChatScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sjå om brukaren er ved botnen
  const isAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true; // Tom chat → antar ved botnen
    const tolerance = 80;
    return el.scrollHeight - el.scrollTop - el.clientHeight < tolerance;
  }, []);

  // glir til botnen — rask (for nye meldingar)
  const scrollToBottom = useCallback((options?: { behavior?: ScrollBehavior }) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: options?.behavior || "auto",
    });
  }, []);

  // Myk gliding til botnen (for UX)
  const smoothScrollToBottom = useCallback(() => {
    scrollToBottom({ behavior: "smooth" });
  }, [scrollToBottom]);

  // Auto-scroll når ny melding kjem — bare om brukaren allerede er ved botnen
  useEffect(() => {
    if (dependency === undefined) return;
    
    const el = scrollRef.current;
    if (!el) return;

    // Berre auto-scroll hvis brukaren er nær botnen
    if (isAtBottom()) {
      requestAnimationFrame(() => {
        scrollToBottom({ behavior: "smooth" });
      });
    }
  }, [dependency, isAtBottom, scrollToBottom]);

  return {
    scrollRef,
    scrollToBottom,
    smoothScrollToBottom,
    isAtBottom,
  };
}

/* ═══════════════════════════════════════
   UTILITY — ChatScrollManager (for avansert bruk)
   ═══════════════════════════════════════ */

export class ChatScrollManager {
  private element: HTMLDivElement | null;

  constructor(element: HTMLDivElement | null) {
    this.element = element;
  }

  scrollToBottom(smooth = false): void {
    if (!this.element) return;
    this.element.scrollTo({
      top: this.element.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  scrollIntoView(element: Element): void {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  isNearBottom(tolerance = 80): boolean {
    if (!this.element) return true;
    return this.element.scrollHeight - this.element.scrollTop - this.element.clientHeight < tolerance;
  }

  getScrollPosition(): { scrollTop: number; scrollHeight: number; clientHeight: number } {
    if (!this.element) return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };
    return {
      scrollTop: this.element.scrollTop,
      scrollHeight: this.element.scrollHeight,
      clientHeight: this.element.clientHeight,
    };
  }
}

export default useChatScroll;