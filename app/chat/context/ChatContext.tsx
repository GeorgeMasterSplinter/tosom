/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Tosom — ChatContext (Premium Nordic Gold 2026) 🟡
 * Global state for heile chat-sida — mindre prop-drilling
 * Brukars-ID blir no sendt som prop fra server-komponent.
 *
 * REAL-TIME: Poller /api/chat/messages hvert 3. sekund for å fange
 * opp nye meldinger fra partneren uten manuell refresh.
 */

"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { MoodId, MoodTheme, getMoodTheme, VALID_MOODS, DEFAULT_MOOD } from "@/app/chat/lib/mood";
import { csrfFetch } from "@/lib/api/csrfClient";
import { getPusherClient } from "@/lib/pusher/client";

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
    /** CHAT-POLISH (C-2): kilde for boble-etikett */
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
  /** Send-feil (vises ved inputfeltet; polling sletter ikke denne) */
  sendError: string | null;
  sessionUserId: string | null;
  /** Visningsnavn til innlogga bruker (navnet valgt i onboarding) */
  myName: string | null;
  /** Parten skriv no (Pusher-event + polling-fallback) */
  partnerTyping: boolean;
  sendMessage: (content: string, type?: MessageType, options?: { source?: "bli_kjent" | "oppgave" }) => Promise<boolean>;
  loadMessages: () => Promise<void>;
  /** Aktive mood */
  mood: MoodId;
  /** Byt mood (per-bruker, lagret i localStorage) */
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
  myName = null,
  children,
}: {
  conversationId: string | null;
  partner?: PartnerInfo;
  journeyDay?: number;
  imageShareAllowed?: boolean;
  sessionUserId?: string;
  myName?: string | null;
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Send-feil er egen state: loadMessages (polling) må ikke overstyre
  // en send-feil — tidlegare forsvann feilen seinast etter 3 sekund, og en
  // feila send ble fullstendig stille.
  const [sendError, setSendError] = useState<string | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mood — PER-BRUKER. Hver person velger sin egen farge/stemning.
  // Lagres i localStorage — ingen API-kall, ingen synk, ingen race.
  const [mood, setMoodState] = useState<MoodId>(() => {
    if (typeof window === "undefined") return DEFAULT_MOOD;
    const stored = localStorage.getItem("tosom_mood");
    return (stored && VALID_MOODS.has(stored as MoodId)) ? stored as MoodId : DEFAULT_MOOD;
  });
  // «Skriver...» for partneren — Pusher-event er kilde, polling er fallback
  const [partnerTyping, setPartnerTyping] = useState(false);
  const moodRef = useRef<MoodId>(mood);

  const setMood = useCallback((newMood: MoodId) => {
    moodRef.current = newMood;
    setMoodState(newMood);
    try { localStorage.setItem("tosom_mood", newMood); } catch { /* SSR/privacy mode */ }
  }, []);

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
          // Navnet valgt i onboarding er kilde — så det er tydelig
          // hvem som har skrevet, også for egne meldinger.
          name: m.sender.profile?.identityName || m.sender.name || "Bruker",
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
      console.error("Feil ved lasting av meldinger:", e);
      if (!isPolling) setError(e instanceof Error ? e.message : "Kunne ikke laste meldinger");
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

    // Poll every 3 seconds for new messages (fallback)
    pollRef.current = setInterval(() => {
      loadMessages(true);
    }, 3000);

    // Pusher real-time: abonner på kanalen for denne samtalen.
    // Pusher gir øyeblikkelig varsling; polling dekker opp ved forbindelsesfeil.
    const pusher = getPusherClient();
    // PRIVATE kanal — pusher-js henter auth-token fra /api/pusher/auth
    // (signert kun til samtale-deltakere). Polling (3s) er fallback.
    const channelName = `private-conversation-${conversationId}`;
    let channel: any = null;
    let typingTimer: ReturnType<typeof setTimeout> | null = null;
    if (pusher) {
      channel = pusher.subscribe(channelName);
      channel.bind('new-message', () => {
        loadMessages(true);
      });
      // Skriveindikator — øyeblikkelig «Skriver...» når partneren skriver
      channel.bind('typing', (data: any) => {
        if (data?.senderId === sessionUserId) return;
        if (data?.isTyping) {
          setPartnerTyping(true);
          if (typingTimer) clearTimeout(typingTimer);
          typingTimer = setTimeout(() => setPartnerTyping(false), 4000);
        } else {
          setPartnerTyping(false);
        }
      });
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (typingTimer) clearTimeout(typingTimer);
      if (pusher && channel) {
        pusher.unsubscribe(channelName);
      }
    };
  }, [conversationId, loadMessages, sessionUserId]);

  const sendMessage = useCallback(async (content: string, type: MessageType = "text", options?: { source?: "bli_kjent" | "oppgave" }): Promise<boolean> => {
    if (!conversationId) return false;

    // ── OPTIMISTISK SEND ─────────────────────────────────────────────
    // Meldingen vises med en gang (ikke vent på API-et). Ved feil
    // rulles den tilbake, og feilen vises ved inputfeltet.
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // Polling må ikke telle temp-meldingen som en «ny» fra serveren
    lastMsgIdRef.current = tempId;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender: "me",
        type,
        content,
        metadata: {
          timestamp: new Date().toISOString(),
          // Egen melding — eget navn (partner-info var satt ved feile side).
          // source medfølger slik at «💎 Bli kjent» / «📋 Oppgave»-merket
          // vises med en gang, ikke først ved neste lasting.
          senderInfo: myName ? { name: myName } : undefined,
          ...(options?.source ? { source: options.source } : {}),
        },
      },
    ]);

    try {
      const res = await csrfFetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content, type, ...(options?.source ? { source: options.source } : {}) }),
      });
      if (!res.ok) {
        let detail = `Feil ved sending: ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody?.error) detail = String(errBody.error);
        } catch { /* holder status-meldingen */ }
        throw new Error(detail);
      }
      const data = await res.json();
      setSendError(null);

      // Byt ut den optimistiske meldingen med serverens (ekte id + tid)
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
                  senderInfo: myName ? { name: myName } : undefined,
                  ...(options?.source ? { source: options.source } : {}),
                },
              }
            : m
        )
      );
      return true;
    } catch (e) {
      console.error("Feil ved sending av melding:", e);
      // Rull tilbake den optimistiske meldingen + vis feilen
      // (egen feilstate — polling sletter ikke denne, så feilen blir synlig)
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError(e instanceof Error ? e.message : "Kunne ikke sende melding");
      return false;
    }
  }, [conversationId, myName]);

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
      myName: myName ?? null,
      partnerTyping,
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