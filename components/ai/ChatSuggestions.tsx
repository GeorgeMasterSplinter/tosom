/* ═══════════════════════════════════════════
   ToSom — AI Chat Suggestions
   Viser forslag til neste melding basert på samtalekontekst
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface ChatSuggestionsProps {
  conversationId: string;
  lastMessages: Array<{ text: string; sender: "user" | "partner" }>;
  partnerProfile: { name: string; interests: string[]; bio: string };
}

export function ChatSuggestions({ conversationId, lastMessages, partnerProfile }: ChatSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const hasAccess = isFlagEnabled("enableChatTypingIndicator");

  async function fetchSuggestions() {
    if (!hasAccess) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/message-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          lastMessages: lastMessages.slice(-5),
          partnerProfile,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess) return null;

  return (
    <div className="mt-2">
      <button
        onClick={fetchSuggestions}
        disabled={loading}
        className="text-xs text-white/40 hover:text-[var(--ts-gold)] transition-colors disabled:opacity-50"
      >
        {loading ? "Genererer forslag..." : "💡 Få forslag til neste melding"}
      </button>

      {suggestions && (
        <div className="mt-2 space-y-1">
          {suggestions.map((text, i) => (
            <button
              key={i}
              className="block w-full text-left p-2 rounded text-xs text-white/60 hover:bg-white/5 transition-colors"
              onClick={() => {
                // Trigger textarea to insert text
                const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
                if (textarea) {
                  textarea.value = text;
                  textarea.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatSuggestions;
