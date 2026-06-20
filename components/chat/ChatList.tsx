/* ═══════════════════════════════════════════
   ToSom Premium — ChatList Component
   Conversation list with avatars, previews, timestamps
   ═══════════════════════════════════════════ */

"use client";

import { Avatar } from "@/components/ui/Avatar";
import { FadeIn } from "@/components/ui/FadeIn";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
}

interface ChatListProps {
  conversations: Conversation[];
  onSelect?: (id: string) => void;
}

export const ChatList = ({ conversations, onSelect }: ChatListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <Avatar size="xl" fallback="?" className="mb-4 opacity-20" />
        <p className="text-white/30 text-sm">Ingen samtaler ennå</p>
        <p className="text-white/20 text-xs mt-1">Dine matcher vil vises her</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv, i) => (
        <FadeIn key={conv.id} duration={300} delay={i * 40}>
          <button
            onClick={() => onSelect?.(conv.id)}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.04] text-left"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar src={conv.avatar} size="md" />
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[var(--ts-bg-primary)] rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white group-hover:text-[var(--ts-gold)] transition-color duration-200 truncate">
                  {conv.name}
                </h4>
                <span className="text-[11px] text-white/30 flex-shrink-0 ml-2">
                  {conv.timestamp}
                </span>
              </div>
              <p className="text-xs text-white/40 truncate mt-0.5">
                {conv.lastMessage}
              </p>
            </div>

            {/* Unread badge */}
            {conv.unread && conv.unread > 0 && (
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--ts-gold)] text-xs font-medium text-[var(--ts-bg-primary)]">
                {conv.unread}
              </span>
            )}
          </button>
        </FadeIn>
      ))}
    </div>
  );
};

export default ChatList;