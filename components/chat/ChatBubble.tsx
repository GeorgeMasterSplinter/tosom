'use client';

import { color, radius, shadow, typography } from '@/config/design-tokens';

interface ChatBubbleProps {
  message: string;
  sender: 'me' | 'them';
  timestamp?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

export default function ChatBubble({
  message,
  sender,
  timestamp,
  isFirstInGroup = false,
  isLastInGroup = true,
}: ChatBubbleProps) {
  const isMe = sender === 'me';

  const bubbleStyle: React.CSSProperties = isMe
    ? {
        background: 'rgba(80, 120, 255, 0.06)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${color.border.blue}`,
        borderRadius: isLastInGroup
          ? `${radius.xl}px ${radius.xl}px ${radius.sm}px ${radius.xl}px`
          : `${radius.sm}px ${radius.xl}px ${radius.sm}px ${radius.xl}px`,
        color: color.text.primary,
        boxShadow: shadow.md,
      }
    : {
        background: 'rgba(212, 175, 55, 0.06)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${color.border.gold}`,
        borderRadius: isLastInGroup
          ? `${radius.xl}px ${radius.xl}px ${radius.xl}px ${radius.sm}px`
          : `${radius.xl}px ${radius.sm}px ${radius.xl}px ${radius.xl}px`,
        color: color.text.primary,
        boxShadow: shadow.md,
      };

  const timestampColor = isMe ? color.text['gold-soft'] : color.text.muted;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.3s_ease-out_both]`}>
      <div className="max-w-[75%] md:max-w-[65%]">
        {!isMe && isFirstInGroup && (
          <p className="text-xs mb-1 px-1" style={{ color: color.text.subtle }}>
            {message.charAt(0)}
          </p>
        )}
        <div className="transition-all duration-300 hover:opacity-90" style={bubbleStyle}>
          <p className="text-sm whitespace-pre-wrap break-words" style={{ lineHeight: typography.lineHeight.normal }}>
            {message}
          </p>
          {timestamp && (
            <p className="mt-1.5 text-right" style={{ color: timestampColor, fontSize: `${typography.fontSize.xs}px` }}>
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}