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
  sessionUserId: string | null;
  sendMessage: (content: string, type?: MessageType) => Promise<void>;
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
   MOOD STORAGE — persistert per samtale-ID
   ═══════════════════════════════════════ */

const MOOD_STORAGE_PREFIX = "tosom:mood:";

function loadMoodFromStorage(conversationId: string | null): MoodId {
  if (!conversationId || typeof window === "undefined") return DEFAULT_MOOD;
  try {
    const stored = localStorage.getItem(`${MOOD_STORAGE_PREFIX}${conversationId}`);
    if (stored && VALID_MOODS.has(stored as MoodId)) return stored as MoodId;
  } catch { /* localStorage utilgjengelig */ }
  return DEFAULT_MOOD;
}

function saveMoodToStorage(conversationId: string | null, mood: MoodId): void {
  if (!conversationId || typeof window === "undefined") return;
  try {
    localStorage.setItem(`${MOOD_STORAGE_PREFIX}${conversationId}`, mood);
  } catch { /* localStorage utilgjengelig */ }
}

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
  const lastMsgIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mood-state — init fra DEFAULT_MOOD, les frå storage ved montering/samtale-endring
  const [mood, setMoodState] = useState<MoodId>(DEFAULT_MOOD);

  useEffect(() => {
    setMoodState(loadMoodFromStorage(conversationId));
  }, [conversationId]);

  const setMood = useCallback((newMood: MoodId) => {
    setMoodState(newMood);
    saveMoodToStorage(conversationId, newMood);
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

  const sendMessage = useCallback(async (content: string, type: MessageType = "text") => {
    if (!conversationId) return;
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content, type }),
      });
      if (!res.ok) throw new Error(`Feil ved sending: ${res.status}`);
      const data = await res.json();

      // Optimistic update — vis melding umiddelbart
      const newMsgId = data.message.id || `msg-${Date.now()}`;
      lastMsgIdRef.current = newMsgId;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          sender: "me",
          type,
          content,
          metadata: { timestamp: new Date().toISOString(), senderInfo: partner },
        },
      ]);
    } catch (e) {
      console.error("Feil ved sending av melding:", e);
      setError(e instanceof Error ? e.message : "Kunne ikke sende melding");
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