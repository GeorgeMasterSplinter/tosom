'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/hooks/useChatMessages';
import { color, radius, shadow, spacing, typography } from '@/config/design-tokens';
import ChatBubble from './ChatBubble';
import ChatTypingIndicator from './ChatTypingIndicator';

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
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (messages.length !== prevMsgCountRef.current) {
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
        </div>
      </div>
    );
  }

  // Tom tilstand — IntroBubble
  if (empty) {
    return (
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-[720px] mx-auto flex flex-col items-center justify-center h-full">
          <div
            className="px-5 py-4 rounded-2xl mb-8"
            style={{
              background: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.08)',
              backdropFilter: 'blur(12px)',
              maxWidth: '320px',
              animation: 'fadeInUp 0.6s ease-out both',
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

          {/* Start knappe */}
          {onEmptyStateAction && (
            <button
              onClick={onEmptyStateAction}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                borderRadius: `${radius.xl}px`,
              }}
            >
              {emptyActionLabel}
            </button>
          )}
        </div>
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

  const getTimestampColor = (isMine: boolean): string => {
    return isMine ? color.text['gold-soft'] : color.text.muted;
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-[720px] mx-auto" style={{ gap: `${spacing.xl}px` }}>
        {groups.map((group, gi) => (
          <div key={group.date}>
            {/* Dato-divider */}
            {gi > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{ background: color.border.dark }} />
                <span style={{ color: color.text.subtle, fontSize: `${spacing.xs}px`, fontWeight: 500 }}>
                  {group.date}
                </span>
                <div className="flex-1 h-px" style={{ background: color.border.dark }} />
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
              const isLastInGroup = mi === group.messages.length - 1 || group.messages[mi + 1]?.senderId !== msg.senderId;

              return (
                <ChatBubble
                  key={msg.id}
                  message={msg.content}
                  sender={isMine ? 'me' : 'them'}
                  timestamp={time}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && <ChatTypingIndicator isActive={isTyping} />}

        <div ref={messagesEndRef} />
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