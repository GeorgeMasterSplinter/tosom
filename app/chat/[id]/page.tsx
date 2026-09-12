/**
 * Tosom — Chat Page (Server Wrapper)
 *
 * Renderer ChatPageClient. Auth-porten ligger i klienten + API-ruta
 * (GET /api/chat/conversation/{id}), IKKE i denne server-komponenten:
 * next-auth auth() leser ikke session-cookien pålitelig i en React Server
 * Component i dette setup-et (Next 15 + next-auth beta.25) og kastet logget
 * inn brukere til /login. Bruker-id (sessionUserId) hentes derfor i klienten.
 */

import ChatPageClient from './ChatPageClient';

export const dynamic = "force-dynamic";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  return <ChatPageClient params={params} />;
}
