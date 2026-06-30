/**
 * ToSom — PremiumMessageList
 * 
 * Meldingsliste med:
 *   - Smooth scroll til ny melding
 *   - Staggered fade-in
 *   - Auto-scroll til botnen
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import PremiumMessageBubble from './PremiumMessageBubble';
import PremiumTypingIndicator from './PremiumTypingIndicator';
import type { ChatMood } from '@/lib/chatAnimations/chatAnimations';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  resonanceScore: number;
  isNew?: boolean;
}

interface PremiumMessageListProps {
  messages: Message[];
  mood?: ChatMood;
  isTyping?: boolean;
  isTypingPartner?: boolean;
}

export default function PremiumMessageList({
  messages,
  mood = 'calm',
  isTyping = false,
  isTypingPartner = false,
}: PremiumMessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Smooth scroll til botnen når ny melding kjem
  const scrollToBottom = useCallback((force: boolean = false) => {
    if (!bottomRef.current || !listRef.current) return;
    
    const behavior = force ? 'auto' : 'smooth';
    bottomRef.current.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length, scrollToBottom]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
              Ingen meldingar enno
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '12px', marginTop: '8px' }}>
              Start samtalen — dei første orda er dei viktigaste
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, i) => (
          <PremiumMessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            resonanceScore={msg.resonanceScore}
            isNew={msg.isNew ?? false}
            animationType="warm-glow"
            mood={mood}
            index={i}
            fadeInDelay={i * 80}
          />
        ))
      )}

      {/* Typing-indikator */}
      {isTypingPartner && (
        <div className="flex justify-start">
          <PremiumTypingIndicator
            active={isTypingPartner}
            color={mood === 'warm' ? '#E8C766' : mood === 'deep' ? '#A8D8EA' : '#D4AF37'}
          />
        </div>
      )}

      {/* Scroll-target */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}