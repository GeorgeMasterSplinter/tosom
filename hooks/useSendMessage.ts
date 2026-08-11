/**
 * ToSom — useSendMessage (Produktnivå)
 * 
 * Sender meldinger til ei samtale via API.
 * - Optimistisk oppdatering
 * - Reset input
 * - Trigger pusher-event via refresh
 */

import { useState, useCallback } from 'react';
import { ChatMessage } from './useChatMessages';

interface UseSendMessageOptions {
  onSuccess?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
}

interface UseSendMessageReturn {
  sending: boolean;
  error: string | null;
  lastMessage: ChatMessage | null;
  sendMessage: (conversationId: string, content: string) => Promise<ChatMessage | null>;
  clearError: () => void;
}

export function useSendMessage(options?: UseSendMessageOptions): UseSendMessageReturn {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<ChatMessage | null> => {
    if (!conversationId || !content.trim() || sending) {
      return null;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content: content.trim() }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          const errorMsg = 'Du er ikke logget inn';
          setError(errorMsg);
          options?.onError?.(errorMsg);
          return null;
        }
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || 'Kunne ikke sende melding';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return null;
      }

      const message: ChatMessage = await res.json();
      setLastMessage(message);
      options?.onSuccess?.(message);
      return message;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukjent feil';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return null;
    } finally {
      setSending(false);
    }
  }, [sending, options]);

  return { sending, error, lastMessage, sendMessage, clearError };
}