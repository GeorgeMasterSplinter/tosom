/**
 * ToSom ToSomChatBubble — System component
 * 
 * Chat message bubble with sent/received variants.
 */

'use client';

import { FC } from 'react';
import { spacing, colors } from '@/config/design-tokens';

type BubbleVariant = 'sent' | 'received';

interface ToSomChatBubbleProps {
  message: string;
  timestamp: string;
  variant?: BubbleVariant;
}

export const ToSomChatBubble: FC<ToSomChatBubbleProps> = ({
  message,
  timestamp,
  variant = 'received',
}) => {
  const isSent = variant === 'sent';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className="max-w-[70%] px-4 py-3"
        style={{
          borderRadius: isSent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isSent
            ? 'rgba(212,175,55,0.15)'
            : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isSent ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
          color: isSent ? colors.gold : colors.textPrimary,
        }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)', textAlign: isSent ? 'right' : 'left' }}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ToSomChatBubble;