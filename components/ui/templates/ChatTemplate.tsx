/**
 * ChatTemplate — Full chat page layout
 *
 * Usage:
 *   <ChatTemplate participant={participant}>
 *     <ChatWindowV2 messages={msgs} onSend={send} />
 *   </ChatTemplate>
 */

import React from 'react';

export interface ChatTemplateProps {
  /** Page children (chat content) */
  children: React.ReactNode;
  /** Participant info */
  participant?: {
    name: string;
    avatar?: string;
    online?: boolean;
    lastSeen?: string;
  };
  /** Chat actions */
  actions?: Array<{ icon: string; label: string; onClick: () => void }>;
  /** Custom class */
  className?: string;
}

const ChatTemplate: React.FC<ChatTemplateProps> = ({
  children,
  participant,
  actions,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-ts-bg-primary flex flex-col ${className}`}>
      {/* Chat header */}
      {participant && (
        <div className="sticky top-0 z-50 border-b border-white/5 bg-ts-bg-primary/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {participant.avatar ? (
                <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-ts-gold/20 flex items-center justify-center border border-white/10">
                  <span className="text-sm font-semibold text-ts-gold">{participant.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <h2 className="text-sm font-semibold text-ts-primary">{participant.name}</h2>
                <p className="text-xs text-ts-text-subtle">
                  {participant.online ? 'Online' : participant.lastSeen ? `Sist sett ${participant.lastSeen}` : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {actions?.map((a, i) => (
                <button
                  key={i}
                  onClick={a.onClick}
                  className="w-9 h-9 rounded-lg bg-ts-glass/50 border border-white/8 flex items-center justify-center text-ts-text-secondary hover:text-ts-gold hover:border-ts-gold/20 transition-all"
                  title={a.label}
                >
                  <span>{a.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-ts-glass/30 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['📎', '📷', '😊'].map((icon, i) => (
              <button key={i} className="w-8 h-8 rounded-lg bg-ts-glass/50 border border-white/8 flex items-center justify-center text-xs text-ts-text-secondary hover:text-ts-gold transition-all">
                {icon}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
            <input
              type="text"
              placeholder="Skriv ein melding..."
              className="flex-1 bg-transparent text-sm text-ts-primary placeholder:text-ts-text-muted focus:outline-none"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-ts-gold flex items-center justify-center text-ts-bg">
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

ChatTemplate.displayName = 'ChatTemplate';
export default ChatTemplate;