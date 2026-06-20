/**
 * ChatBubbleV2 — Individual chat message bubble
 *
 * Usage:
 *   <ChatBubbleV2
 *     text="Hello!"
 *     sender="user"
 *     timestamp={new Date()}
 *     isSystem={false}
 *   />
 */

import React from 'react';

export interface ChatBubbleV2Props {
  /** Message text */
  text: string;
  /** Sender */
  sender?: 'user' | 'other' | 'system';
  /** Timestamp */
  timestamp?: Date | string;
  /** Whether system message */
  isSystem?: boolean;
  /** Custom class */
  className?: string;
}

const ChatBubbleV2: React.FC<ChatBubbleV2Props> = ({
  text,
  sender = 'other',
  timestamp,
  isSystem = false,
  className = '',
}) => {
  if (isSystem || sender === 'system') {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-ts-text-subtle bg-ts-glass/50 px-3 py-1.5 rounded-full border border-white/5">
          {text}
        </span>
      </div>
    );
  }

  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      <div
        className={`
          max-w-[75%]
          px-4 py-3
          text-sm
          leading-relaxed
          ${isUser
            ? 'bg-ts-gold/15 border-ts-gold/25 text-ts-gold rounded-[18px_18px_4px_18px]'
            : 'bg-white/[0.06] border-white/8 text-ts-primary rounded-[18px_18px_18px_4px]'
          }
          border
          backdrop-blur-sm
        `}
      >
        {text}
      </div>
    </div>
  );
};

ChatBubbleV2.displayName = 'ChatBubbleV2';
export default ChatBubbleV2;