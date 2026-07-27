/**
 * ToSom — ChatContext (Premium Nordic Gold 2026) 🟡
 * Global state for heile chat-sida — mindre prop-drilling
 */

"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

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
  sendMessage: (content: string, type?: MessageType) => Promise<void>;
  loadMessages: () => Promise<void>;
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
  children,
}: {
  conversationId: string | null;
  partner?: PartnerInfo;
  journeyDay?: number;
  imageShareAllowed?: boolean;
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Last meldingar når conversationId endrar seg
  useEffect(() => {
    if (conversationId) loadMessages();
  }, [conversationId]);

  // Get sessionUserId from session (we know it exists because ChatProvider is only used when logged in)
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // We'll pass this via props or get it from context
    // For now, default to "me" logic based on mock data
    setSessionUserId("current-user-id"); // Will be replaced with real session
  }, []);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok) {
        throw new Error(`Feil: ${res.status}`);
      }
      const data = await res.json();
      // Konverter til unified format
      const converted: ChatMessage[] = (data.messages || []).map((m: any) => ({
        id: m.id,
        sender: m.senderId !== sessionUserId ? "partner" : "me",
        type: (m.type as MessageType) || "text",
        content: m.content,
        metadata: {
          timestamp: m.createdAt,
          senderInfo: m.sender ? { name: m.sender.name, imageUrl: m.sender.profile?.image ?? undefined } : undefined,
        },
      }));
      setMessages(converted);
    } catch (e) {
      console.error("Feil ved lasting av meldingar:", e);
      setError(e instanceof Error ? e.message : "Kunne ikke laste meldingar");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

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
      setMessages((prev) => [
        ...prev,
        {
          id: data.message.id || `msg-${Date.now()}`,
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
      sendMessage,
      loadMessages,
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