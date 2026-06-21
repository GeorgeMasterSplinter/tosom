/**
 * ToSom UI 5.0 — Chat
 * 
 * Guidede, varme og dype samtalar
 * - Systemmeldingar frå reisa dukkar opp automatisk
 * - Oppgåver dukkar opp som system-melding
 * - Refleksjonar dukkar opp som system-melding
 * - Bilde-fase: dag 1-14 tillat ikkje, dag 14+ tillar
 * - Spørsmål-modul integrert
 */

'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';
import QuestionModal from './components/QuestionModal';

/* ------ Types ------ */

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'reflection' | 'system' | 'task';
  createdAt: string;
  senderName?: string | null;
}

interface ImageShareInfo {
  allowed: boolean;
  daysRemaining: number;
}

interface DashboardOverview {
  matchStatus: 'no_match' | 'pending' | 'matched';
  partner: { id: string; profile: { identityName: string | null } } | null;
  isUserA: boolean;
  conversationId: string | null;
  resonance: number | null;
  imageShareStatus: ImageShareInfo | null;
  journey: {
    day: number;
    phase: string;
    completedDays: number;
  } | null;
  nextMatchTimer: {
    locked: boolean;
    readyAt: string | null;
    hoursRemaining: number;
  };
}

/* ------ Helpers ------ */

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
}

/* ------ Main Page ------ */

export default function ChatPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

  /* Fetch dashboard + chat */
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const ovRes = await fetch('/api/dashboard/overview');
        if (!ovRes.ok) return;
        const ov = await ovRes.json();
        if (!cancelled) setOverview(ov);

        if (ov.conversationId) {
          const chatRes = await fetch(`/api/chat/messages?conversationId=${ov.conversationId}`);
          if (chatRes.ok && !cancelled) {
            const chat = await chatRes.json();
            setMessages(chat.messages || []);
          }
        }
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();

    const interval = setInterval(fetchAll, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Send message */
  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending || !overview?.conversationId) return;

    // Sjekk for /spørsmål kommando
    if (trimmed.startsWith('/spørsmål') || trimmed.startsWith('/question')) {
      setShowQuestions(true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: overview.conversationId,
          content: trimmed,
          type: 'text',
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        if (!text.startsWith('/')) {
          setInput('');
        }
      }
    } catch {
      // Silently fail
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSendMessage(input);
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
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
            Lastar chat...
          </p>
        </div>
      </div>
    );
  }

  /* No active match */
  if (!overview || overview.matchStatus !== 'matched' || !overview.conversationId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto mb-4"
            style={{ color: 'rgba(212, 175, 55, 0.2)' }}
          >
            <path d="M8 20C8 14 13 10 20 10C27 10 32 14 32 20C32 26 27 30 20 30L14 32L16 28C15 26 14 24 14 20C14 16 17 13 20 13C23 13 26 16 26 20C26 24 23 27 20 27" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p
            className="text-lg mb-6"
            style={{ color: 'rgba(255, 255, 255, 0.45)' }}
          >
            Ingen aktiv samtale
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
            style={{
              background: '#D4AF37',
              color: '#0B0E11',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = '#E8C766';
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = '#D4AF37';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Gå til dashboard
          </button>
        </div>
      </div>
    );
  }

  const partnerName = overview.partner?.profile?.identityName || 'Noen';
  const isUserA = overview.isUserA;
  const isOwnMessage = (senderId: string) => senderId !== overview.partner?.id;
  const isSystemMessage = (msg: ChatMessage) => msg.type === 'system' || msg.type === 'task' || msg.senderId === 'system';
  const isTaskMessage = (msg: ChatMessage) => msg.type === 'task';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0B0E11' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: 'rgba(11, 14, 17, 0.8)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="mx-auto max-w-[1200px] px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ease-out"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.07)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Partner info */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  color: '#D4AF37',
                }}
              >
                {partnerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  {partnerName}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  {overview.journey
                    ? `Dag ${overview.journey.day} · ${overview.journey.phase}`
                    : 'Aktiv'}
                </p>
              </div>
            </div>

            {/* Resonance */}
            {overview.resonance !== null && (
              <div
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                }}
              >
                Resonans: {overview.resonance}/10
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-8 py-8">
          {/* Welcome */}
          <div className="text-center py-8">
            <p
              className="text-sm"
              style={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              Dy er låste saman dei neste 30 dagane.
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'rgba(255, 255, 255, 0.2)' }}
            >
              Nyt reisa di saman med {partnerName}.
            </p>
          </div>

          {messages.map((msg, i) =>
            isSystemMessage(msg) ? (
              /* System message */
              <div key={msg.id || i} className="flex justify-center mb-4">
                <GlassPanel
                  goldBorder={isTaskMessage(msg)}
                  padding="md"
                  className={`max-w-sm ${isTaskMessage(msg) ? 'bg-[rgba(212,175,55,0.05)]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: '#D4AF37' }}
                    >
                      <path d="M8 1L9.5 6L14 7L10 10L11 15L8 12.5L5 15L6 10L2 7L6.5 6L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex-1">
                      <p
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {msg.content}
                      </p>
                      <p
                        className="text-xs mt-2"
                        style={{ color: 'rgba(255, 255, 255, 0.2)' }}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            ) : (
              /* Message */
              <div
                key={msg.id || i}
                className={`flex mb-4 ${isOwnMessage(msg.senderId) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-sm px-4 py-3 rounded-2xl"
                  style={
                    isOwnMessage(msg.senderId)
                      ? {
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          borderRadius: '18px 18px 4px 18px',
                        }
                      : {
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '18px 18px 18px 4px',
                        }
                  }
                >
                  {!isOwnMessage(msg.senderId) && msg.senderName && (
                    <p
                      className="text-xs mb-1"
                      style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {msg.senderName}
                    </p>
                  )}
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {msg.content}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.2)',
                      textAlign: isOwnMessage(msg.senderId) ? 'right' : 'left',
                    }}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0 border-t"
        style={{
          background: 'rgba(11, 14, 17, 0.8)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="mx-auto max-w-[720px] px-8 py-4">
          {/* Bilde-fase info */}
          {overview.imageShareStatus && !overview.imageShareStatus.allowed && (
            <p
              className="text-xs text-center mb-3"
              style={{ color: 'rgba(255, 255, 255, 0.25)' }}
            >
              Bilder er tilgjengeleg om {overview.imageShareStatus.daysRemaining} dagar
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3">
            {/* Spørsmål-knapp */}
            <button
              type="button"
              onClick={() => setShowQuestions(true)}
              className="px-4 py-3 rounded-xl flex-shrink-0 transition-all duration-200 ease-out"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(212, 175, 55, 0.1)';
                (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.3)';
                (e.target as HTMLElement).style.color = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.6)';
              }}
              title="Åpne spørsm-generator"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.24 2 5 4.24 5 7C5 8.8 5.75 10.4 6.95 11.55C7.4 11.98 7.7 12.55 7.7 13.2V14.5C7.7 14.78 7.92 15 8.2 15H11.8C12.08 15 12.3 14.78 12.3 14.5V13.8C12.3 12.8 13.1 12 14.1 12H15C17.76 12 20 9.76 20 7C20 4.24 17.76 2 15 2H10ZM10 4C11.66 4 13 5.34 13 7C13 8.66 11.66 10 10 10C8.34 10 7 8.66 7 7C7 5.34 8.34 4 10 4ZM10 18C9 18 8 17.5 7.5 16.8C7.3 16.45 7.55 16 7.95 16H12.05C12.45 16 12.7 16.45 12.5 16.8C12 17.5 11 18 10 18Z" fill="currentColor" transform="scale(0.8) translate(2, 2)" />
              </svg>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv ein melding... eller /spørsmål"
              className="flex-1 rounded-xl px-4 py-3 text-sm transition-all duration-200 ease-out"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                backdropFilter: 'blur(12px)',
              }}
              onFocus={(e) => {
                (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
                (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
              }}
              onBlur={(e) => {
                (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
              disabled={sending}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out flex items-center gap-2"
              style={{
                background: sending ? 'rgba(212, 175, 55, 0.3)' : '#D4AF37',
                color: '#0B0E11',
              }}
              disabled={sending || !input.trim()}
              onMouseEnter={(e) => {
                if (!sending) {
                  (e.target as HTMLElement).style.background = '#E8C766';
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = sending ? 'rgba(212, 175, 55, 0.3)' : '#D4AF37';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14L14 8L6 2L6 7L2 7L2 9L6 9L6 14Z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestions && (
        <QuestionModal
          onClose={() => setShowQuestions(false)}
          onSend={(text) => {
            handleSendMessage(text);
            setShowQuestions(false);
          }}
        />
      )}
    </div>
  );
}