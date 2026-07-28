'use client';

import { use, useState, useEffect } from 'react';
import { ChatProvider } from '@/app/chat/context/ChatContext';
import { ChatContainer, DEV_CONVERSATION_ID } from '@/app/chat/components/ChatContainer';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';

interface ChatPageParams {
  id: string;
}

interface PartnerInfo {
  name: string;
  age: number;
}

export default function ChatPage({ params }: { params: Promise<ChatPageParams> }) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<PartnerInfo | null>(null);

  useEffect(() => {
    // Dev-mode: bruk mock-data
    if (conversationId === DEV_CONVERSATION_ID) {
      setPartner({ name: 'Emma', age: 28 });
      setLoading(false);
      return;
    }

    // Prod-mode: hent partner info frå API
    async function fetchPartner() {
      try {
        const res = await fetch(`/api/chat/${conversationId}`);
        if (!res.ok) throw new Error('Kunne ikkje hente samtale-informasjon');
        const data = await res.json();
        setPartner({ name: data.partnerName || 'Din partner', age: data.partnerAge ?? 25 });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setLoading(false);
      }
    }

    fetchPartner();
  }, [conversationId]);

  if (loading) {
    return <ChatSkeleton />;
  }

  if (error && !partner) {
    return (
      <ErrorState
        title="Kunne ikkje laste samtalen"
        description={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const partnerData = partner ?? { name: 'Din partner', age: 25 };
  const isDev = conversationId === DEV_CONVERSATION_ID;
  const providerConversationId = isDev ? null : conversationId;

  return (
    <ChatProvider
      conversationId={providerConversationId}
      partner={partnerData}
      journeyDay={5}
      imageShareAllowed={false}
    >
      <ChatContainer
        conversationId={conversationId}
        partner={partnerData}
        journeyDay={5}
        imageShareAllowed={false}
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
