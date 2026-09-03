/**
 * ToSom — useChatRealtime Hook
 * 
 * Abonnerer på Pusher-kanalar for sanntids-oppdateringar.
 * - Ny melding i chat
 * - Oppdatert samtale i lista
 * - Typing-indikator
 */

import { useEffect, useRef, useCallback, useState } from 'react';

declare const Pusher: any;

interface PusherEvent {
  senderId: string;
  [key: string]: unknown;
}

interface UseChatRealtimeOptions {
  conversationId?: string;
  userId?: string | null;
  onNewMessage?: (message: PusherEvent) => void;
  onConversationUpdated?: (data: { conversationId: string }) => void;
  onTyping?: (data: { senderId: string; isTyping: boolean }) => void;
}

export function useChatRealtime(options: UseChatRealtimeOptions) {
  const pusherRef = useRef<any>(null);
  const conversationChannelRef = useRef<any>(null);
  const userChannelRef = useRef<any>(null);

  const init = useCallback(() => {
    const { conversationId, userId } = options;
    if (!conversationId || !userId) return;

    // Init Pusher (client-side SDK)
    if (!pusherRef.current && typeof window !== 'undefined') {
      const key = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu';
      pusherRef.current = new Pusher(key, { cluster, authEndpoint: '/api/pusher/auth' });
    }

    const pusher = pusherRef.current;
    if (!pusher) return;

    // Abonner på samtale-kanal (private — auth via /api/pusher/auth)
    if (conversationChannelRef.current) {
      pusher.unsubscribe(`private-conversation-${conversationId}`);
    }
    conversationChannelRef.current = pusher.subscribe(`private-conversation-${conversationId}`);

    // Abonner på user-kanal
    if (userChannelRef.current) {
      pusher.unsubscribe(`user-${userId}`);
    }
    userChannelRef.current = pusher.subscribe(`user-${userId}`);

    // Ny melding i samtale
    conversationChannelRef.current.bind('new-message', (message: PusherEvent) => {
      // Ignorer egne meldinger (allerede lagt til lokalt)
      if (message.senderId === userId) return;
      options.onNewMessage?.(message);
    });

    // Samtale oppdatert (for samtaleliste)
    userChannelRef.current.bind('conversation-updated', (data: { conversationId: string }) => {
      options.onConversationUpdated?.(data);
    });

    // Typing-indikator
    conversationChannelRef.current.bind('typing', (data: { senderId: string; isTyping: boolean }) => {
      options.onTyping?.(data);
    });

    // Start connection
    pusher.connect();
  }, [options]);

  const stop = useCallback(() => {
    const pusher = pusherRef.current;
    if (pusher) {
      // Kanal-objektets .name er ALLEREDE det fulle kanal-navnet
      // (private-conversation-… / user-…) — ikke prepender prefiks.
      if (conversationChannelRef.current) {
        pusher.unsubscribe(conversationChannelRef.current.name);
      }
      if (userChannelRef.current) {
        pusher.unsubscribe(userChannelRef.current.name);
      }
      pusher.disconnect();
      pusherRef.current = null;
    }
  }, []);

  useEffect(() => {
    init();
    return () => stop();
  }, [init, stop]);

  return { init, stop };
}

/**
 * Typing-indikator state
 */
export function useTypingIndicator(conversationId: string | undefined, userId: string | null) {
  const [typingUsers, setTypingUsers] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!conversationId || !userId) return;

    const handleTyping = (data: { senderId: string; isTyping: boolean }) => {
      if (data.senderId === userId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.senderId, Date.now());
        } else {
          next.delete(data.senderId);
        }
        return next;
      });
    };

    // Rens typing etter 3 sekund inaktivitet
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const next = new Map(prev);
        for (const [id, ts] of next) {
          if (now - ts > 3000) next.delete(id);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationId, userId]);

  return typingUsers;
}