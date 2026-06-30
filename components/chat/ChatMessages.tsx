/**
 * ToSom — ChatMessages (Produktnivå med Micro-interactions)
 * 
 * Viser alle meldingar i ein chat med:
 * - fade-in animasjon
 * - glassmorphism bobler
 * - avsender venstre/høgre
 * - auto-scroll til bunn
 * - rolig spacing
 * - gull-detaljar på partner-bobler
 * - typing-indikator
 * - smooth scroll ved nye meldingar
 * - puls-animasjon på nye bobler
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/hooks/useChatMessages';

interface ChatMessagesProps {
  messages: ChatMessage[];
  userId: string | null;
  empty?: boolean;
  emptyActionLabel?: string;
  onEmptyStateAction?: () => void;
  loading?: boolean;
  isTyping?: boolean;
  resonanceScore?: number;
}

export default function ChatMessages({
  messages,
  userId,
  empty = false,
  emptyActionLabel = 'Start samtale',
  onEmptyStateAction,
  loading = false,
  isTyping = false,
  resonanceScore = 0,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);

  // Smooth scroll ved nye meldingar
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        // Stabilt scroll som unngjer jump
        force: true,
      });
    }
  }, []);

  useEffect(() => {
    // Berre scroll dersom meldingsmengd har endra seg
    if (messages.length !== prevMsgCountRef.current) {
      // Tiny delay for animasjon
      const timer = setTimeout(scrollToBottom, 50);
      prevMsgCountRef.current = messages.length;
      return () => clearTimeout(timer);
    }
  }, [messages.length, scrollToBottom]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
            Lastar meldingar...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Tom tilstand — vis IntroBubble i meldingslista i staden for heil side
  if (empty) {
    return (
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-[720px] mx-auto flex flex-col items-center justify-center h-full">
          {/* IntroBubble — vis som ein boble i samtalen */}
          <div
            className="px-5 py-4 rounded-2xl mb-8 animate-[fadeInUp_0.6s_ease-out_both]"
            style={{
              background: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.08)',
              backdropFilter: 'blur(12px)',
              maxWidth: '320px',
            }}
          >
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              Det er tomt her — men det blir ikkje det.
              <br />
              <span style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '13px' }}>
                Det første steget er alltid det viktigaste. Bare sei hei.
              </span>
            </p>
          </div>

          {/* Resonans-badge */}
          {resonanceScore > 0 && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: `rgba(212, 175, 55, ${0.05 + resonanceScore / 500})`,
                border: '1px solid rgba(212, 175, 55, 0.15)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#D4AF37' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ color: '#D4AF37', fontSize: '12px', fontWeight: 500 }}>
                Dere matcher {Math.round(resonanceScore)}%
              </span>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Grupper meldingar etter dag for tidslinje
  let lastDate = '';
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentGroup: { date: string; messages: ChatMessage[] } | null = null;

  for (const msg of messages) {
    const msgDate = new Date(msg.createdAt).toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (msgDate !== lastDate) {
      lastDate = msgDate;
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { date: msgDate, messages: [msg] };
    } else if (currentGroup) {
      currentGroup.messages.push(msg);
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-[720px] mx-auto space-y-6">
        {groups.map((group, gi) => (
          <div key={group.date}>
            {/* Dato-divider */}
            {gi > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.04)' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '11px', fontWeight: 500 }}>
                  {group.date}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.04)' }} />
              </div>
            )}

            {/* Meldingar */}
            {group.messages.map((msg, mi) => {
              const isMine = msg.senderId === userId;
              const senderName = msg.sender?.profile?.identityName || 'Ukjent';
              const time = new Date(msg.createdAt).toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const isFirstInGroup = mi === 0 || group.messages[mi - 1].senderId !== msg.senderId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.3s_ease-out_both]`}
                  style={{ animationDelay: `${gi * 0.1 + mi * 0.04}s` }}
                >
                  <div className="max-w-[75%] md:max-w-[65%]">
                    {/* Namn for første melding i gruppe */}
                    {!isMine && isFirstInGroup && (
                      <p
                        className="text-xs mb-1 px-1"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        {senderName}
                      </p>
                    )}
                    <div
                      className="px-4 py-2.5 transition-all duration-300"
                      style={{
                        background: isMine
                          ? 'rgba(212, 175, 55, 0.12)'
                          : 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: isMine ? 'blur(16px)' : 'blur(12px)',
                        border: isMine
                          ? '1px solid rgba(212, 175, 55, 0.25)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: isFirstInGroup
                          ? isMine
                            ? '18px 18px 4px 18px'
                            : '18px 18px 18px 4px'
                          : isMine
                            ? '4px 18px 4px 18px'
                            : '18px 4px 18px 18px',
                        color: isMine ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                        boxShadow: isMine
                          ? '0 2px 16px rgba(212, 175, 55, 0.12), 0 0 8px rgba(212, 175, 55, 0.06)'
                          : '0 2px 12px rgba(0, 0, 0, 0.06)',
                        animation: 'bubbleAppear 0.4s ease-out both, bubblePulse 3s infinite ease-in-out',
                        animationDelay: isMine ? '0s, 2s' : '0s, 3s',
                      }}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed" style={{ animation: 'textFade 0.3s ease-out both' }}>
                        {msg.content}
                      </p>
                      <p
                        className="text-[10px] mt-1.5 text-right"
                        style={{ color: isMine ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.25)' }}
                      >
                        {time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-[fadeInUp_0.3s_ease-out_both]">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-4xl"
              style={{
                background: 'rgba(212, 175, 55, 0.06)',
                border: '1px solid rgba(212, 175, 55, 0.12)',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.12)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex gap-1.5 items-center">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'rgba(212, 175, 55, 0.7)',
                    animation: 'typingDot 1.2s infinite ease-in-out',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'rgba(212, 175, 55, 0.5)',
                    animation: 'typingDot 1.2s infinite ease-in-out 0.15s',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'rgba(212, 175, 55, 0.7)',
                    animation: 'typingDot 1.2s infinite ease-in-out 0.3s',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: scale(0.85); opacity: 0.4; }
          30% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 24px rgba(212, 175, 55, 0.08); }
          50% { box-shadow: 0 0 48px rgba(212, 175, 55, 0.15); }
        }
        @keyframes bubbleAppear {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
            box-shadow: 0 0 0 rgba(212, 175, 55, 0);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            box-shadow: 0 2px 16px rgba(212, 175, 55, 0.12);
          }
        }
        @keyframes bubblePulse {
          0%, 100% {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          }
          50% {
            box-shadow: 0 2px 16px rgba(212, 175, 55, 0.08), 0 0 20px rgba(212, 175, 55, 0.04);
          }
        }
        @keyframes textFade {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}