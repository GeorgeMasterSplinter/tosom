// typingTracker.ts — typing start/stop events via Supabase realtime
// (Bruker Supabase for true realtime-meldingar)

import { supabase } from "@/lib/supabase";

const TYPING_CHANNEL = "typing-status";
const TYPING_TIMEOUT = 5000; // 5 sekund etter siste tast før "stopp"

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

/**
 * Start typing-indikator for ein bruker i ei conversation.
 */
export async function startTyping(conversationId: string, userId: string): Promise<void> {
  if (!supabase) {
    console.warn("[typingTracker] Supabase ikkje tilgjengeleg — typing ikkje send");
    return;
  }

  const event: TypingEvent = {
    conversationId,
    userId,
    isTyping: true,
    timestamp: Date.now(),
  };

  await supabase
    .from("typing_status")
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      is_typing: true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
    .catch((err) => {
      console.error("[typingTracker] Feil ved sending av typing-start:", err);
    });
}

/**
 * Stopp typing-indikator.
 */
export async function stopTyping(conversationId: string, userId: string): Promise<void> {
  if (!supabase) return;

  await supabase
    .from("typing_status")
    .update({ is_typing: false, updated_at: new Date().toISOString() })
    .match({ conversation_id: conversationId, user_id: userId })
    .select()
    .single()
    .catch((err) => {
      console.error("[typingTracker] Feil ved sending av typing-stopp:", err);
    });
}

/**
 * Lytt på typing-events for ei gitt conversation.
 */
export function onTypingEvent(
  conversationId: string,
  callback: (event: TypingEvent) => void,
): { unsubscribe: () => void } {
  if (!supabase) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase.channel(TYPING_CHANNEL);

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "typing_status",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const { new: newRow }: { new: { conversation_id: string; user_id: string; is_typing: boolean; updated_at: string } } = payload;
        if (newRow) {
          callback({
            conversationId: newRow.conversation_id,
            userId: newRow.user_id,
            isTyping: newRow.is_typing,
            timestamp: new Date(newRow.updated_at).getTime(),
          });
        }
      },
    )
    .subscribe();

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    },
  };
}
