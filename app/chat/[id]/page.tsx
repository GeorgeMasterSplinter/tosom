/**
 * ToSom — Chat Page (Server Wrapper)
 * Henter session og renderar ChatPageClient med sessionUserId.
 */

import { getServerSession } from '@/lib/auth/session';
import ChatPageClient from './ChatPageClient';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const resolvedParams = await params;

  // Bruk sessionUserId om tilgjengeleg, elles fallback til conversation-id for dev-mode
  const sessionUserId = session?.user?.id ?? `dev-user-${resolvedParams.id}`;

  return (
    <ChatPageClient
      params={params}
      sessionUserId={sessionUserId}
    />
  );
}