/**
 * Tosom — Chat Page Client Component
 * Klient-komponent som bruker ChatProvider og ChatContainer.
 */

"use client";

import { use, useState, useEffect } from 'react';
import { ChatProvider } from '@/app/chat/context/ChatContext';
import { ChatContainer } from '@/app/chat/components/ChatContainer';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';

interface ChatPageParams {
  id: string;
}

interface PartnerInfo {
  id: string;
  name: string;
  age: number;
  distanceKm: number | null;
}

/** Hent partner-info + mitt visningsnavn frå conversation */
async function fetchPartnerInfo(
  conversationId: string
): Promise<{ partner: PartnerInfo | null; myName: string | null }> {
  try {
    const res = await fetch(`/api/chat/conversation/${conversationId}`);
    if (!res.ok) return { partner: null, myName: null };
    const data = await res.json();
    return {
      partner: {
        id: data.partnerId || '',
        name: data.partnerName || 'Din partner',
        age: data.partnerAge ?? 25,
        distanceKm: data.distanceKm ?? null,
      },
      // Navnet jeg har valgt i onboarding — vises over mine egne bobler
      myName: data.myName ?? null,
    };
  } catch {
    return { partner: null, myName: null };
  }
}

// Journey-day blir henta via session — ikke treng conversationId
// Denne funksjonen er bare for fallback, faktiske journeyDay kommer fra ChatProvider
async function fetchJourneyDayFallback(): Promise<number> {
  try {
    const res = await fetch(`/api/journey/progress`);
    if (!res.ok) return 1;
    const data = await res.json();
    return data.journey?.day ?? 1;
  } catch {
    return 1;
  }
}

/** Hent om bilde-deeling er tillatt */
async function fetchImageShareAllowed(conversationId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/chat/conversation/${conversationId}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.imageShareAllowed ?? false;
  } catch {
    return false;
  }
}

interface ChatPageProps {
  params: Promise<ChatPageParams>;
  sessionUserId: string;
}

export default function ChatPage({ params, sessionUserId }: ChatPageProps) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [myName, setMyName] = useState<string | null>(null);
  const [journeyDay, setJourneyDay] = useState<number>(1);
  const [imageShareAllowed, setImageShareAllowed] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const [info, images] = await Promise.all([
          fetchPartnerInfo(conversationId),
          fetchImageShareAllowed(conversationId),
        ]);
        setPartner(info.partner);
        setMyName(info.myName);
        setImageShareAllowed(images);
        // Hent journey-day fallback — ChatProvider har også default 1
        const day = await fetchJourneyDayFallback();
        setJourneyDay(day);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [conversationId]);

  if (loading) {
    return <ChatSkeleton />;
  }

  if (error && !partner) {
    return (
      <ErrorState
        title="Kunne ikke laste samtalen"
        description={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const partnerData = partner ?? { id: '', name: 'Din partner', age: 25, distanceKm: null };

  return (
    <ChatProvider
      conversationId={conversationId}
      partner={partnerData}
      journeyDay={journeyDay}
      imageShareAllowed={imageShareAllowed}
      sessionUserId={sessionUserId}
      myName={myName}
    >
      <ChatContainer
        conversationId={conversationId}
        partner={partnerData}
        journeyDay={journeyDay}
        imageShareAllowed={imageShareAllowed}
      />
    </ChatProvider>
  );
}

function ChatSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1520' }}>
      <div style={{ width: '100%', maxWidth: '640px', padding: '24px' }}>
        <CardSkeleton lines={6} />
      </div>
    </div>
  );
}