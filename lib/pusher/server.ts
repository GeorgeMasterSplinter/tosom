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

export async function triggerNewMessage(conversationId: string, message: Record<string, unknown>) {
  const pusher = getPusherServer();
  await pusher.trigger(`conversation-${conversationId}`, 'new-message', message);
}

export async function triggerConversationUpdated(userId: string, conversationId: string) {
  const pusher = getPusherServer();
  await pusher.trigger(`user-${userId}`, 'conversation-updated', { conversationId });
}

export async function triggerTyping(conversationId: string, senderId: string, isTyping: boolean) {
  const pusher = getPusherServer();
  await pusher.trigger(`conversation-${conversationId}`, 'typing', { senderId, isTyping });
}