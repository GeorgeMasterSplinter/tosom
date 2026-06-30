/**
 * ToSom — ChatRoom (Produktnivå med Micro-interactions + Journey-integrasjon)
 * 
 * Hoved-container for ein chat mellom to menneske.
 * Integrasjon med ToSom journey-system for fase-basert UI.
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useChatRealtime } from '@/hooks/useChatRealtime';

interface ChatRoomProps {
  conversationId: string;
  partner: {
    id: string;
    name: string;
    age?: number;
    image: string | null;
    online?: boolean;
    matchTags?: string[];
  };
  phaseLabel?: string;
  phaseOrder?: number;
  currentDay?: number;
  daysRemaining?: number;
  showHeader?: boolean;
  resonanceScore?: number;
  isSafe?: boolean;
}

interface ChatRoomState {
  userId: string | null;
  isTyping: boolean;
  partnerTyping: boolean;
  lastMessageId: string | null;
  sessionFetched: boolean;
}

/**
 * Error Boundary for Chat
 */
class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex-1 flex items-center justify-center" style={{ background: '#0B0E11' }}>
          <div className="text-center p-8 rounded-2xl max-w-md" style={{
            background: 'rgba(255, 77, 77, 0.05)',
            border: '1px solid rgba(255, 77, 77, 0.15)',
          }}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m3 3H9m1-16l10.5 18L1.5 12" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-base font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Noko gjekk gale
            </p>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Vi har logga feilen. Ver vennleg og prøv igjen.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * "Stille øyeblikk" component — viser rolege, meningsfulle quotes
 * når det er stille i chat-en
 */
function SilentMoment({ phaseOrder }: { phaseOrder: number }) {
  const moments = [
    'Ta deg tid. Det viktigaste kjem ikkje av seg sjølv.',
    'Stille øyeblikk er der vi vokser mest.',
    'I ro finn vi svarene.',
    'Pust. Du er trygg her.',
  ];
  
  return (
    <div
      className="text-center py-6 px-8 rounded-2xl"
      style={{
        background: 'rgba(212, 175, 55, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.08)',
        animation: 'silentFade 8s infinite ease-in-out',
      }}
    >
      <p style={{ color: 'rgba(212, 175, 55, 0.4)', fontSize: '13px', fontStyle: 'italic' }}>
        "{moments[phaseOrder % moments.length]}"
      </p>
    </div>
  );
}

export default function ChatRoom({
  conversationId,
  partner,
  phaseLabel = 'Fase 1 — Introduksjon',
  phaseOrder = 1,
  currentDay = 1,
  daysRemaining = 30,
  showHeader = true,
  resonanceScore = 0,
  isSafe = false,
}: ChatRoomProps) {
  const [state, setState] = useState<ChatRoomState>({
    userId: null,
    isTyping: false,
    partnerTyping: false,
    lastMessageId: null,
    sessionFetched: false,
  });
  const [isSendingFirst, setIsSendingFirst] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const [showSilent, setShowSilent] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hente session (brukar-ID)
  const fetchSession = useCallback(async () => {
    if (state.sessionFetched) return;
    try {
      const res = await fetch('/api/auth/signin?json=true');
      if (res.ok) {
        const data = await res.json();
        setState(prev => ({
          ...prev,
          userId: data?.session?.id ?? null,
          sessionFetched: true,
        }));
      }
    } catch {
      setState(prev => ({ ...prev, sessionFetched: true }));
    }
  }, [state.sessionFetched]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Meldingar
  const { messages, loading, error, refresh } = useChatMessages(conversationId, state.userId);

  // Send melding
  const { sending, sendMessage } = useSendMessage({
    onSuccess: (msg) => {
      setState(prev => ({ ...prev, lastMessageId: msg.id }));
      refresh();
      lastActivityRef.current = Date.now();
    },
  });

  // Sanntid (Pusher)
  const { init: initRealtime, stop: stopRealtime } = useChatRealtime({
    conversationId,
    userId: state.userId,
    onNewMessage: () => {
      refresh();
      lastActivityRef.current = Date.now();
    },
    onTyping: (data) => {
      if (data.senderId !== state.userId) {
        setState(prev => ({ ...prev, partnerTyping: data.isTyping }));
      }
    },
  });

  // Init sanntid når session er klar
  useEffect(() => {
    if (conversationId && state.userId) {
      initRealtime();
      return () => stopRealtime();
    }
  }, [conversationId, state.userId, initRealtime, stopRealtime]);

  // Stille øyeblikk — vis etter 30 sekund inaktivitet (fase 3+)
  useEffect(() => {
    const checkSilence = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (phaseOrder >= 3 && elapsed > 30000 && messages.length > 0) {
        setShowSilent(true);
        setTimeout(() => setShowSilent(false), 8000);
      }
    }, 10000);
    return () => clearInterval(checkSilence);
  }, [phaseOrder, messages.length]);

  // Send-handling
  const handleSend = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;
    lastActivityRef.current = Date.now();
    const result = await sendMessage(conversationId, content);
    if (result) {
      setState(prev => ({ ...prev, isTyping: false }));
      try {
        await fetch('/api/chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, isTyping: false }),
        });
      } catch { /* ignore */ }
    }
  }, [conversationId, sendMessage, sending]);

  // Typing indicator
  const handleTypingStart = useCallback(() => {
    lastActivityRef.current = Date.now();
    setState(prev => ({ ...prev, isTyping: true }));
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, isTyping: true }),
        });
      } catch { /* ignore */ }
    }, 500);
  }, [conversationId]);

  const handleTypingEnd = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setState(prev => ({ ...prev, isTyping: false }));
  }, []);

  // Tom tilstand-knapp
  const handleEmptyAction = useCallback(() => {
    setIsSendingFirst(true);
  }, []);

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <div className="w-full max-w-[480px] mx-auto h-[100dvh] flex flex-col bg-[#0B0E11]">
        {showHeader && (
          <div style={{
            background: 'rgba(11, 14, 17, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 rounded-full animate-pulse" style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }} />
              <div className="flex-1">
                <div className="h-4 w-24 rounded animate-pulse mb-2" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
                <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
              Lastar samtale...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  // Phase-basert warm-fargar for bobler (fase 3+)
  const getBubbleWarmth = () => {
    if (phaseOrder >= 4) return 'rgba(255, 130, 200, 0.08)'; // meir varm
    if (phaseOrder >= 3) return 'rgba(180, 140, 255, 0.06)'; // varm
    return 'rgba(255, 255, 255, 0.06)'; // roleg
  };

  // Phase-basert input-størrelse (fase 4+)
  const getInputSize = () => {
    if (phaseOrder >= 4) return 'px-6 py-4 text-base';
    return 'px-5 py-3.5 text-sm';
  };

  return (
    <ChatErrorBoundary>
      <div className="w-full max-w-[480px] mx-auto h-[100dvh] flex flex-col bg-[#0B0E11]">
        {/* Header */}
        {showHeader && (
          <ChatHeader
            partnerName={partner.name}
            partnerAge={partner.age}
            partnerImage={partner.image}
            phaseLabel={phaseLabel}
            phaseOrder={phaseOrder}
            currentDay={currentDay}
            daysRemaining={daysRemaining}
            online={partner.online}
            resonanceScore={resonanceScore}
            isSafe={isSafe}
          />
        )}

        {/* Messages — ingen knapp, berre intro-bubble */}
        <ChatMessages
          messages={messages}
          userId={state.userId}
          empty={messages.length === 0}
          loading={false}
          isTyping={state.partnerTyping}
          resonanceScore={resonanceScore}
        />

        {/* Stille øyeblikk */}
        {showSilent && phaseOrder >= 3 && (
          <div className="px-4 py-4">
            <div className="max-w-[720px] mx-auto">
              <SilentMoment phaseOrder={phaseOrder} />
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          onTypingStart={handleTypingStart}
          onTypingEnd={handleTypingEnd}
          placeholder="Skriv ei melding…"
          disabled={!state.userId}
          sending={sending}
        />
      </div>
    </ChatErrorBoundary>
  );
}