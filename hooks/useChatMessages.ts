/**
 * ToSom — useChatMessages (Produktnivå)
 * 
 * Hentar og synkroniserer meldingar for ei samtale.
 * - Last meldinger
 * - setLoading(false)
 * - Handter 401
 * - Sanntid via pusher (refresh callback)
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    profile: { identityName: string | null };
  };
}

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useChatMessages(
  conversationId: string | undefined,
  userId: string | null
): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastIdRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      
      if (res.status === 401) {
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Kunne ikkje hente meldingar');
      }

      const data: ChatMessage[] = await res.json();
      
      // Finn den siste meldings-ID-en før vi oppdaterer
      const lastMsg = data[data.length - 1];
      const newLastId = lastMsg?.id ?? null;
      
      // Berre oppdater dersom data har endra seg
      if (JSON.stringify(data) !== JSON.stringify(messages) || messages.length === 0) {
        setMessages(data);
        setLoading(false);
        
        // Lagre siste ID for å unngje double-render
        lastIdRef.current = newLastId;
      }
    } catch (err) {
      if (!error || error !== 'Kunne ikkje hente meldingar') {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      }
      setLoading(false);
    }
  }, [conversationId, messages]);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    // Last inn meldingar
    refresh();

    // Poll kvart 3. sekund for nye meldingar
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [conversationId, refresh]);

  return { messages, loading, error, refresh };
}