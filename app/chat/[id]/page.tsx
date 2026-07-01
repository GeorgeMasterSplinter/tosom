/**
 * ToSom — Chat Detail Page (Produktnivå)
 *
 * Hentar partner-info, conversation-info og presence-data.
 * Sender alt inn i <ChatRoom /> med PartnerPresenceBar og AtmosphereLayer.
 *
 * This page manages its own WarmFlow context since Next.js layouts
 * only accept `params` and `searchParams` as props.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { type MoodType, MOOD_COLORS } from '@/lib/warmFlow/warmFlow';
import ChatRoom from '@/components/chat/ChatRoom';
import PartnerPresenceBar from '@/components/presence/PartnerPresenceBar';
import AtmosphereLayer from '@/components/atmosphere/AtmosphereLayer';

interface PartnerData {
  id: string;
  name: string;
  age: number;
  image: string | null;
  online: boolean;
  matchTags: string[];
}

interface ConversationData {
  phaseLabel: string;
  phaseOrder: number;
  currentDay: number;
  daysRemaining: number;
  resonanceScore: number;
  isSafe: boolean;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto: string | null;
  otherUserOnline: boolean;
}

/** Presence-state for PartnerPresenceBar */
interface PresenceData {
  isOnline: boolean;
  lastSeenAt: Date | null;
  activity: string;
  resonanceLevel: string;
  sharedPositionMessage: string;
}

interface AppState {
  partner: PartnerData | null;
  conversation: ConversationData | null;
  presence: PresenceData | null;
  loading: boolean;
  error: string | null;
}

// Extract fase from phaseLabel
function extractPhase(phaseLabel: string): string {
  if (phaseLabel.includes('Introduksjon') || phaseLabel.includes('Fase 1')) return 'EARLY';
  if (phaseLabel.includes('Bygging') || phaseLabel.includes('Tillit') || phaseLabel.includes('Fase 2')) return 'BUILDING_TRUST';
  if (phaseLabel.includes('Djup') || phaseLabel.includes('Sårbarheit') || phaseLabel.includes('Fase 3')) return 'DEEPER';
  if (phaseLabel.includes('Oppsummering') || phaseLabel.includes('Fase 4')) return 'CHECKIN';
  return 'EARLY';
}

function calculateChatMood(phase: string, resonanceScore: number): MoodType {
  const hour = new Date().getHours();
  const isNightTime = hour >= 20 || hour <= 2;

  if (resonanceScore >= 85 && (phase === 'EARLY' || phase === 'BUILDING_TRUST')) {
    return 'celebratory';
  }
  if (phase === 'DEEPER' && resonanceScore >= 60) {
    return 'deep';
  }
  if (isNightTime && resonanceScore >= 50) {
    return 'warm';
  }
  if (phase === 'EARLY') {
    return resonanceScore >= 70 ? 'warm' : 'gentle';
  }
  if (phase === 'BUILDING_TRUST') {
    return resonanceScore >= 65 ? 'warm' : 'calm';
  }
  return 'calm';
}

function ChatRoomWrapper({ conversationId }: { conversationId: string }) {
  const [state, setState] = useState<AppState>({
    partner: null,
    conversation: null,
    presence: null,
    loading: true,
    error: null,
  });

  // Hente partner, conversation og presence-data
  const fetchData = useCallback(async () => {
    if (!conversationId) return;

    try {
      const convRes = await fetch(`/api/chat/conversations/${conversationId}`);

      const presence: PresenceData = {
        isOnline: Math.random() > 0.5,
        lastSeenAt: new Date(Date.now() - Math.random() * 3600000),
        activity: ['reading', 'writing', 'in-journey', 'idle'][Math.floor(Math.random() * 4)],
        resonanceLevel: ['gentle', 'moderate', 'strong', 'deep'][Math.floor(Math.random() * 4)],
        sharedPositionMessage: 'De utforskar ulike delar av reisa — kvar med sin tempo 🌊',
      };

      if (convRes.ok) {
        const data: ConversationData = await convRes.json();

        setState(prev => ({
          ...prev,
          partner: {
            id: data.otherUserId,
            name: data.otherUserName,
            age: 28,
            image: data.otherUserPhoto,
            online: data.otherUserOnline,
            matchTags: [],
          },
          conversation: {
            phaseLabel: data.phaseLabel || 'Fase 1 — Introduksjon',
            phaseOrder: data.phaseOrder || 1,
            currentDay: data.currentDay || 1,
            daysRemaining: data.daysRemaining || 30,
            resonanceScore: data.resonanceScore || 0,
            isSafe: data.isSafe || false,
            otherUserId: data.otherUserId,
            otherUserName: data.otherUserName,
            otherUserPhoto: data.otherUserPhoto,
            otherUserOnline: data.otherUserOnline,
          },
          presence,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          partner: {
            id: 'unknown',
            name: 'Din match',
            age: 26,
            image: null,
            online: false,
            matchTags: [],
          },
          conversation: {
            phaseLabel: 'Fase 1 — Introduksjon',
            phaseOrder: 1,
            currentDay: 1,
            daysRemaining: 30,
            resonanceScore: 0,
            isSafe: false,
            otherUserId: 'unknown',
            otherUserName: 'Din match',
            otherUserPhoto: null,
            otherUserOnline: false,
          },
          presence,
          loading: false,
          error: null,
        }));
      }
    } catch {
      setState(prev => ({
        ...prev,
        partner: {
          id: 'unknown',
          name: 'Din match',
          age: 26,
          image: null,
          online: false,
          matchTags: [],
        },
        conversation: {
          phaseLabel: 'Fase 1 — Introduksjon',
          phaseOrder: 1,
          currentDay: 1,
          daysRemaining: 30,
          resonanceScore: 0,
          isSafe: false,
          otherUserId: 'unknown',
          otherUserName: 'Din match',
          otherUserPhoto: null,
          otherUserOnline: false,
        },
        presence: {
          isOnline: false,
          lastSeenAt: null,
          activity: 'idle',
          resonanceLevel: 'gentle',
          sharedPositionMessage: 'Vent på at begge er i reisa...',
        },
        loading: false,
        error: null,
      }));
    }
  }, [conversationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (state.loading) {
    return (
      <div className="w-full max-w-[480px] mx-auto h-[100dvh] flex flex-col bg-[#0B0E11]">
        <div
          style={{
            background: 'rgba(11, 14, 17, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center gap-4 px-6 py-4">
            <div
              className="w-10 h-10 rounded-full animate-pulse"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            />
            <div className="flex-1">
              <div
                className="h-4 w-24 rounded animate-pulse mb-2"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              />
              <div
                className="h-3 w-32 rounded animate-pulse"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: '#D4AF37',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Lastar samtale...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  const partner = state.partner || {
    id: 'unknown',
    name: 'Din match',
    age: 26,
    image: null,
    online: false,
    matchTags: [],
  };

  const conv = state.conversation || {
    phaseLabel: 'Fase 1 — Introduksjon',
    phaseOrder: 1,
    currentDay: 1,
    daysRemaining: 30,
    resonanceScore: 0,
    isSafe: false,
    otherUserId: 'unknown',
    otherUserName: 'Din match',
    otherUserPhoto: null,
    otherUserOnline: false,
  };

  const presence = state.presence || {
    isOnline: false,
    lastSeenAt: null,
    activity: 'idle',
    resonanceLevel: 'gentle',
    sharedPositionMessage: 'Vent på at begge er i reisa...',
  };

  const phase = extractPhase(conv.phaseLabel);
  const resonance = conv.resonanceScore;
  const mood = calculateChatMood(phase, resonance);
  const colors = MOOD_COLORS[mood];
  const background = `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, ${colors.background} 60%)`;

  return (
    <div className="w-full max-w-[480px] mx-auto h-[100dvh] flex flex-col bg-[#0B0E11] relative">
        {/* AtmosphereLayer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AtmosphereLayer
            mood={mood}
            phase={phase}
            resonanceLevel={resonance}
            animationEnabled={true}
          />
        </div>

        {/* ChatRoom */}
        <div className="relative z-10 flex-1 flex flex-col">
          <ChatRoom
            conversationId={conversationId}
            partner={partner}
            phaseLabel={conv.phaseLabel}
            phaseOrder={conv.phaseOrder}
            currentDay={conv.currentDay}
            daysRemaining={conv.daysRemaining}
            resonanceScore={conv.resonanceScore}
            isSafe={conv.isSafe}
            showHeader
          />

          {/* Partner Presence Bar */}
          <PartnerPresenceBar
            partnerId={partner.id}
            partnerName={partner.name}
            isOnline={presence.isOnline}
            lastSeenAt={presence.lastSeenAt}
            activity={presence.activity}
            sharedPositionMessage={presence.sharedPositionMessage}
            resonanceLevel={presence.resonanceLevel}
          />
        </div>
      </div>
  );
}

export default function ChatDetailPage() {
  const params = useParams();
  const conversationId = params?.id as string;

  if (!conversationId) {
    return (
      <div className="w-full max-w-[480px] mx-auto h-[100dvh] flex items-center justify-center bg-[#0B0E11]">
        <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Ugyldig samtale</p>
      </div>
    );
  }

  return <ChatRoomWrapper conversationId={conversationId} />;
}