/**
 * ToSom — Chat List Page (MEGAMODUL)
 * 
 * Viser alle samtalar for brukaren med:
 * - Pusher-sanntid for nye/mottatte meldingar
 * - Premium glass + gull UI
 * - Fade-in animasjonar
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChatRealtime } from '@/hooks/useChatRealtime';

interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    sender: {
      id: string;
      profile: { identityName: string | null };
    };
  } | null;
  otherUser: {
    id: string;
    email: string;
    identityName: string | null;
    photoUrl: string | null;
  };
}

export default function ChatListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ id: string } | null>(null);

  // Sanntids-oppdatering for samtaleliste
  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Kunne ikke hente samtalar');
      }
      const data = await res.json();
      setConversations(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukjent feil');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // Session
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/signin?json=true');
        if (res.ok) {
          const data = await res.json();
          setSession(data?.session?.user ?? null);
        }
      } catch {
        // Use fallback
      }
    }
    fetchSession();
  }, []);

  // Pusher sanntid for samtaleliste
  useChatRealtime({
    userId: session?.id,
    onConversationUpdated: () => {
      refreshConversations();
    },
  });

  // Loading state
  if (loading) {
    return (
      <>
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
              Lastar samtalar...
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
    <main className="mx-auto max-w-[720px] px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-[fadeIn_0.4s_ease-out]">
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: '#FFFFFF' }}
          >
            Samtaler
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Dine aktive samtalar og matcher
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-xl mb-6 text-center animate-[fadeIn_0.3s_ease-out]"
            style={{
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              color: '#FF4D4D',
            }}
          >
            {error}
          </div>
        )}

        {/* No conversations */}
        {conversations.length === 0 && !error && (
          <div className="text-center py-16 animate-[fadeIn_0.5s_ease-out]">
            <svg
              width="64"
              height="64"
              viewBox="0 0 48 48"
              fill="none"
              className="mx-auto mb-4"
              style={{ color: 'rgba(212, 175, 55, 0.15)' }}
            >
              <path
                d="M8 20C8 14 13 10 20 10C27 10 32 14 32 20C32 26 27 30 20 30L14 32L16 28C15 26 14 24 14 20C14 16 17 13 20 13C23 13 26 16 26 20C26 24 23 27 20 27"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-lg mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Ingen samtalar ennå
            </p>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              Når du matcher med nokon, dukkar samtalen her opp.
            </p>
          </div>
        )}

        {/* Conversations list */}
        <div className="space-y-3">
          {conversations.map((convo, i) => {
            const otherName = convo.otherUser.identityName || 'Ukjent';
            const lastContent = convo.lastMessage?.content ?? 'Ingen meldingar enno';
            const lastTime = convo.lastMessage
              ? new Date(convo.lastMessage.createdAt).toLocaleTimeString('no-NO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <Link
                key={convo.id}
                href={`/chat/${convo.id}`}
                className="block mb-3 transition-all duration-300 ease-out group animate-[slideIn_0.3s_ease-out]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      color: '#D4AF37',
                    }}
                  >
                    {otherName.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-base"
                      style={{ color: '#FFFFFF' }}
                    >
                      {otherName}
                    </p>
                    <p
                      className="text-sm truncate"
                      style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                      {lastContent}
                    </p>
                  </div>

                  {/* Time */}
                  {lastTime && (
                    <p
                      className="text-xs flex-shrink-0"
                      style={{ color: 'rgba(255, 255, 255, 0.25)' }}
                    >
                      {lastTime}
                    </p>
                  )}

                  {/* Arrow */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 transition-all duration-200"
                    style={{
                      color: 'rgba(212, 175, 55, 0.4)',
                      transform: 'translateX(-4px)',
                    }}
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
