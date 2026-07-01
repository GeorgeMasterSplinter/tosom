/**
 * ToSom — PremiumMessageBubble
 * 
 * Meldingsboble med:
 *   - Bubble-animasjon (pop-in, slide-fade, warm-glow, soft-land, breathe-in)
 *   - Resonance-glow ved høg resonans (>=70)
 *   - Progressiv tekst-avdekking for nye meldingar
 *   - Mood-basert farge
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { BUBBLE_ANIMATIONS, getBubbleCSS, MoodType as ChatMoodType } from '@/lib/chatAnimations/chatAnimations';

interface PremiumMessageBubbleProps {
  /** Meldingstekst */
  text: string;
  /** Sendar ('me' eller 'them') */
  sender: 'me' | 'them';
  /** Resonans-nivå for denne meldinga (0-100) */
  resonanceScore?: number;
  /** Er meldinga ny (skal ha progressiv avdekking) */
  isNew?: boolean;
  /** Animasjonstype */
  animationType?: keyof typeof BUBBLE_ANIMATIONS;
  /** Mood frå WarmFlow */
  mood?: ChatMoodType;
  /** Indeks for stagger */
  index?: number;
  /** Fade-in delay */
  fadeInDelay?: number;
}

export default function PremiumMessageBubble({
  text,
  sender,
  resonanceScore = 0,
  isNew = false,
  animationType = 'warm-glow',
  mood = 'calm',
  index = 0,
  fadeInDelay = 0,
}: PremiumMessageBubbleProps) {
  const [revealedText, setRevealedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasGlow, setHasGlow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMe = sender === 'me';

  // Animasjon-visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), fadeInDelay);
    return () => clearTimeout(timer);
  }, [fadeInDelay]);

  // Resonance-glow
  useEffect(() => {
    setHasGlow(resonanceScore >= 70);
  }, [resonanceScore]);

  // Progressiv avdekking for nye meldingar
  useEffect(() => {
    if (!isNew) {
      setRevealedText(text);
      return;
    }

    let start: number | null = null;
    const duration = text.length * 15; // 15ms per teikn

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const charsToShow = Math.floor(text.length * progress);
      setRevealedText(text.slice(0, charsToShow));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRevealedText(text);
      }
    };

    if (isVisible) {
      requestAnimationFrame(animate);
    }
  }, [isNew, text, isVisible]);

  // Hent bubble-animasjon CSS
  const animation = BUBBLE_ANIMATIONS[animationType];
  const bubbleCSS = getBubbleCSS(animation);

  // Resonance-glow style
  const glowStyle = hasGlow ? {
    boxShadow: `0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.15)`,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  } : undefined;

  // Mood-basert farge
  const moodColors: Record<ChatMoodType, { bg: string; border: string }> = {
    calm: { bg: 'rgba(255, 255, 255, 0.04)', border: 'rgba(255, 255, 255, 0.08)' },
    warm: { bg: 'rgba(232, 199, 102, 0.08)', border: 'rgba(232, 199, 102, 0.2)' },
    deep: { bg: 'rgba(168, 216, 234, 0.06)', border: 'rgba(168, 216, 234, 0.15)' },
    gentle: { bg: 'rgba(136, 216, 176, 0.06)', border: 'rgba(136, 216, 176, 0.15)' },
    joyful: { bg: 'rgba(255, 215, 0, 0.08)', border: 'rgba(255, 215, 0, 0.2)' },
  };

  const colors = moodColors[mood] || moodColors.calm;

  return (
    <div
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: bubbleCSS,
      }}
    >
      <div
        ref={containerRef}
        className={`max-w-[75%] px-4 py-3 transition-all duration-300 ${
          isMe
            ? 'rounded-tl-[16px] rounded-tr-[8px] rounded-bl-[16px] rounded-br-[8px]'
            : 'rounded-tl-[8px] rounded-tr-[16px] rounded-bl-[8px] rounded-br-[16px]'
        }`}
        style={{
          background: hasGlow
            ? `linear-gradient(135deg, ${colors.bg}, rgba(212, 175, 55, 0.1))`
            : colors.bg,
          border: `1px solid ${hasGlow ? 'rgba(212, 175, 55, 0.35)' : colors.border}`,
          ...glowStyle,
        }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {revealedText}
          {isNew && revealedText.length < text.length && (
            <span className="inline-block w-0.5 h-4 ml-0.5 bg-white/50 animate-blink" />
          )}
        </p>
      </div>
    </div>
  );
}