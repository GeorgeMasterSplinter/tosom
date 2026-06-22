/**
 * ToSom — Pusher Client Config
 * 
 * Bruk denne i client-komponentar for å abonnera på kanalar.
 */

import Pusher from 'pusher-js';

// Global singleton for client-side
let pusherInstance: any = null;

export function getPusherClient(): any {
  if (!pusherInstance && typeof window !== 'undefined') {
    pusherInstance = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY || '',
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
        forceTLS: true,
      }
    );
  }
  return pusherInstance;
}

export function getPusherChannel(pusher: any, channelName: string): any {
  return pusher.subscribe(channelName);
}

export function unsubscribeAll(pusher: any): void {
  pusher.unsubscribe(`conversation-placeholder`);
  pusher.unsubscribe(`user-placeholder`);
}