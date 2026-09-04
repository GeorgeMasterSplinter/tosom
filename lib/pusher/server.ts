/**
 * ToSom — Pusher Server Config
 * 
 * Bruk denne i server-side API-ruter for å triggera hendingar.
 */

import Pusher from 'pusher';

let pusherInstance: any = null;

export function getPusherServer(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID || '',
      key: process.env.PUSHER_KEY || '',
      secret: process.env.PUSHER_SECRET || '',
      cluster: process.env.PUSHER_CLUSTER || 'eu',
      useTLS: true,
    });
  }
  return pusherInstance;
}

// Sanntids-chat-kanalen er en PRIVATE Pusher-kanal (`private-conversation-*`):
// pusher-js må hente en signert auth-token fra /api/pusher/auth før den kan
// abonnere. Signeringen (HMAC-SHA256 med PUSHER_SECRET) utstedes KUN til
// innloggede samtale-deltakere — slik at uautoriserte ikke kan lytte på
// samtale-innhold. (user-* kanalen er kun dashboard-varsling uten innhold.)
export async function triggerNewMessage(conversationId: string, message: Record<string, unknown>) {
  const pusher = getPusherServer();
  await pusher.trigger(`private-conversation-${conversationId}`, 'new-message', message);
}

export async function triggerTyping(conversationId: string, senderId: string, isTyping: boolean) {
  const pusher = getPusherServer();
  await pusher.trigger(`private-conversation-${conversationId}`, 'typing', { senderId, isTyping });
}

export async function triggerMoodChange(conversationId: string, senderId: string, mood: string) {
  const pusher = getPusherServer();
  await pusher.trigger(`private-conversation-${conversationId}`, 'mood-changed', { senderId, mood });
}

export async function triggerGameUpdate(
  conversationId: string,
  payload: { sessionId: string; type: string; state: unknown; status: string; winner?: string | null; turn?: string | null },
) {
  const pusher = getPusherServer();
  await pusher.trigger(`private-conversation-${conversationId}`, 'game-updated', payload);
}
