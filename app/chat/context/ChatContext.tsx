/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Tosom — ChatContext (Premium Nordic Gold 2026) 🟡
 * Global state for heile chat-sida — mindre prop-drilling
 * Brukars-ID blir no sendt som prop frå server-komponent.
 *
 * REAL-TIME: Poller /api/chat/messages hvert 3. sekund for å fange
 * opp nye meldingar frå partneren utan manuell refresh.
 */

"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { MoodId, MoodTheme, getMoodTheme, VALID_MOODS, DEFAULT_MOOD } from "@/app/chat/lib/mood";

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

export type SenderType = "me" | "partner" | "system";
export type MessageType = "text" | "image" | "task" | "choice" | "system";

export interface ChatMessage {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  metadata?: {
    imageUrl?: string;
    taskTitle?: string;
    choices?: Array<{ label: string; value: string }>;
    day?: number;
    phase?: string;
    timestamp?: Date | string;
    senderInfo?: { name: string; imageUrl?: string };
    /** CHAT-POLISH (C-2): kjelde for boble-etikett */
    source?: "bli_kjent" | "oppgave";
  };
}

export interface PartnerInfo {
  name: string;
  age: number;
  imageUrl?: string;
  id?: string;
  resonanceScore?: number;
  matchedAt?: string;
}

export interface ChatContextValue {
  conversationId: string | null;
  partner: PartnerInfo | null;
  messages: ChatMessage[];
  journeyDay: number;
  imageShareAllowed: boolean;
  loading: boolean;
  error: string | null;
  /** Send-feil (vises ved inputfeltet; polling slettar ikkje denne) */
  sendError: string | null;
  sessionUserId: string | null;
  sendMessage: (content: string, type?: MessageType, options?: { source?: "bli_kjent" | "oppgave" }) => Promise<boolean>;
  loadMessages: () => Promise<void>;
  /** Aktive mood */
  mood: MoodId;
  /** Byt mood (persistert per samtale) */
  setMood: (mood: MoodId) => void;
  /** Resolved mood-tema for aktiv mood */
  moodTheme: MoodTheme;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/* ═══════════════════════════════════════
   PROVIDER-KOMPONENT
   ═══════════════════════════════════════ */

export function ChatProvider({
  conversationId,
  partner,
  journeyDay = 1,
  imageShareAllowed = false,
  sessionUserId,
  children,
}: {
  conversationId: string | null;
  partner?: PartnerInfo;
  journeyDay?: number;
  imageShareAllowed?: boolean;
  sessionUserId?: string;
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Send-feil er eigen state: loadMessages (polling) må ikkje tilsidesetje
  // ein send-feil — tidlegare forsvann feilen seinast etter 3 sekund, og ein
  // feila send vart fullstendig stille.
  const [sendError, setSendError] = useState<string | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mood-state — DELT mood, server-styrt per samtale. Begge parter deler den;
  // når én bytter, synkroniseres den for begge via polling (og Pusher om aktivert).
  const [mood, setMoodState] = useState<MoodId>(DEFAULT_MOOD);
  const moodRef = useRef<MoodId>(DEFAULT_MOOD);

  const setMood = useCallback((newMood: MoodId) => {
    if (!conversationId) return;
    // Optimistisk: skift temaet lokalt umiddelbart, så bekräftes av server/polling.
    moodRef.current = newMood;
    setMoodState(newMood);
    fetch("/api/chat/mood", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, mood: newMood }),
    }).catch(() => {
      /* Feil ved mood-bytte — polling resynkroniserer fra serveren */
    });
  }, [conversationId]);

  const moodTheme = getMoodTheme(mood);

  const loadMessages = useCallback(async (isPolling = false) => {
    if (!conversationId) return;
    if (!isPolling) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok) {
        throw new Error(`Feil: ${res.status}`);
      }
      const data = await res.json();
      const currentId = sessionUserId;

      // Synkroniser DELT mood fra serveren (begge parter ser alltid samme mood)
      const serverMood = data.mood as MoodId | undefined;
      if (serverMood && VALID_MOODS.has(serverMood) && serverMood !== moodRef.current) {
        moodRef.current = serverMood;
        setMoodState(serverMood);
      }
      const converted: ChatMessage[] = (data.messages || []).map((m: any) => {
        const senderInfo = m.sender ? {
          name: m.sender.name ?? "Bruker",
          imageUrl: m.sender.profile?.photoUrl ?? undefined,
        } : undefined;

        return {
          id: m.id,
          sender: m.senderId !== currentId ? "partner" : "me",
          type: (m.type as MessageType) || "text",
          content: m.content,
          metadata: {
            timestamp: m.createdAt,
            senderInfo,
            ...(m.source ? { source: m.source as "bli_kjent" | "oppgave" } : {}),
          },
        };
      });

      // Dedup: hopp over oppdatering hvis ingen nye meldinger
      const newLastId = converted.length > 0 ? converted[converted.length - 1].id : null;
      if (isPolling && newLastId === lastMsgIdRef.current) return;
      lastMsgIdRef.current = newLastId;

      setMessages(converted);
    } catch (e) {
      console.error("Feil ved lasting av meldingar:", e);
      if (!isPolling) setError(e instanceof Error ? e.message : "Kunne ikke laste meldingar");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [conversationId, sessionUserId]);

  // Initial load + polling (3s) mens conversationId er satt
  useEffect(() => {
    if (!conversationId) return;

    // Reset dedup-ref når conversation byttes
    lastMsgIdRef.current = null;

    // Initial load
    loadMessages();

    // Poll every 3 seconds for new messages (real-time oppdatering)
    pollRef.current = setInterval(() => {
      loadMessages(true);
    }, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [conversationId, loadMessages]);

  const sendMessage = useCallback(async (content: string, type: MessageType = "text", options?: { source?: "bli_kjent" | "oppgave" }): Promise<boolean> => {
    if (!conversationId) return false;

    // ── OPTIMISTISK SEND ─────────────────────────────────────────────
    // Meldinga vises med ein gong (ikkje vent på API-et). Ved feil
    // rullast ho tilbake, og feilen visast ved inputfeltet.
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // Polling må ikkje tala temp-meldinga som ein «ny» frå serveren
    lastMsgIdRef.current = tempId;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender: "me",
        type,
        content,
        metadata: { timestamp: new Date().toISOString(), senderInfo: partner },
      },
    ]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content, type, ...(options?.source ? { source: options.source } : {}) }),
      });
      if (!res.ok) {
        let detail = `Feil ved sending: ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody?.error) detail = String(errBody.error);
        } catch { /* held status-meldinga */ }
        throw new Error(detail);
      }
      const data = await res.json();
      setSendError(null);

      // Byt ut den optimistiske meldinga med serverens (ekte id + tid)
      const serverMsg = data.message || {};
      const newMsgId = serverMsg.id || tempId;
      lastMsgIdRef.current = newMsgId;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                id: newMsgId,
                sender: "me",
                type,
                content: serverMsg.content || content,
                metadata: {
                  timestamp: serverMsg.createdAt || new Date().toISOString(),
                  senderInfo: partner,
                },
              }
            : m
        )
      );
      return true;
    } catch (e) {
      console.error("Feil ved sending av melding:", e);
      // Rull tilbake den optimistiske meldinga + vis feilen
      // (eigen feilstate — polling slettar ikkje denne, så feilen blir synleg)
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError(e instanceof Error ? e.message : "Kunne ikke sende melding");
      return false;
    }
  }, [conversationId, partner]);

  return (
    <ChatContext.Provider value={{
      conversationId,
      partner: partner || null,
      messages,
      journeyDay,
      imageShareAllowed,
      loading,
      error,
      sendError,
      sessionUserId: sessionUserId ?? null,
      sendMessage,
      loadMessages,
      mood,
      setMood,
      moodTheme,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

/* ═══════════════════════════════════════
   HOOK — bruk ChatContext
   ═══════════════════════════════════════ */

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat må brukast inni ChatProvider");
  return ctx;
}

export default ChatContext;