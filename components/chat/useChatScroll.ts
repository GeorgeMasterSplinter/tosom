/**
 * Tosom — useChatScroll Hook
 * Optimalisert scroll-handtering for chat.
 * 
 * Funksjonar:
 * - scrollToBottom() — glir til botnen
 * - smoothScroll — myk scrolling
 * - autoScroll på ny melding — siste melding står ALLTID synleg nede
 *   (uansett hvem som sender; avgjort 2026-08-28). Fyrste lasting er
 *   øyeblikks-scroll, så ingen lang animasjon over historia.
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

  // Se om brukeren er ved botnen
  const isAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true; // Tom chat → antar ved botnen
    const tolerance = 80;
    return el.scrollHeight - el.scrollTop - el.clientHeight < tolerance;
  }, []);

  // glir til botnen — rask (for nye meldinger)
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

  // Siste melding skal ALLTID stå synleg nede, uansett hvem som sender
  // (kreist i CHAT-POLISH 2026-08-28). Alt anna skrus opp over.
  //
  // Fyrste gong lista får innhold: øyeblikks-scroll (landing ved siste
  // melding uten lang smooth-scroll over historia). Deretter myk scroll
  // ved hver ny melding.
  const hasContentRef = useRef(false);
  useEffect(() => {
    if (dependency === undefined) return;
    
    const el = scrollRef.current;
    if (!el) return;

    const count = typeof dependency === "number" ? dependency : 0;
    const instant = count > 0 && !hasContentRef.current;
    if (count > 0) hasContentRef.current = true;

    // Dobbelt rAF: nytt innhold (fleirlinjet tekst, bilde) må legga seg
    // i layouten FØR scrollHeight målast.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom({ behavior: instant ? "auto" : "smooth" });
      });
    });
  }, [dependency, scrollToBottom]);

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