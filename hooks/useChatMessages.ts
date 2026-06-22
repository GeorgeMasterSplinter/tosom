/**
 * ToSom — useChatMessages Hook
 * 
 * Hentar og synkroniserer meldingar for ei samtale.
 */

import { useState, useEffect, useCallback } from 'react';

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
  refresh: () => void;
}

export function useChatMessages(conversationId: string | undefined, userId: string | null): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok) {
        if (res.status === 401) return;
        throw new Error('Kunne ikke hente meldingar');
      }
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      if (!error || error !== 'Kunne ikke hente meldingar') {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      }
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    refresh();
    // Poll kvart 5. sekund for nye meldingar
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [conversationId, refresh]);

  return { messages, loading, error, refresh };
}