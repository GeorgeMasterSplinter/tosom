/**
 * ToSom — Chat Page (Server Wrapper)
 * Henter session og renderar ChatPageClient med sessionUserId.
 */

import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import ChatPageClient from './ChatPageClient';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();

  // B0.7 — Ingen sesjon → ingen pseudo-bruker-id. Send til login for å unngå
  // at alle meldinger rendres som «meg» og for å lukke en potensiell tilgangsfeil.
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <ChatPageClient
      params={params}
      sessionUserId={session.user.id}
    />
  );
}
