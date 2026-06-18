"use client";

import GlassCard from "@/components/ui/GlassCard";
import FadeIn from "@/components/ui/FadeIn";

type Conversation = {
  id: string;
  users: { id: string; name?: string; image?: string }[];
  messages: { id: string; text?: string; imageUrl?: string; senderId?: string; seen?: boolean }[];
};

interface ChatListProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}

export default function ChatList({ conversations, onSelect }: ChatListProps) {
  return (
    <FadeIn>
      <div className="flex flex-col gap-[var(--space-md)]">
        {conversations.map((c) => {
          const other = c.users.find((u) => u.id !== c.users[0].id);
          const last = c.messages[0];
          const hasUnread = c.messages.some((m) => m.senderId !== c.users[0].id && !m.seen);

          return (
            <GlassCard
              key={c.id}
              className="flex items-center gap-[var(--space-sm)] cursor-pointer hover:scale-[1.01]"
            >
              {/* Avatar */}
              {other?.image ? (
                <img
                  src={other.image}
                  alt={other.name || "Ukjent"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-gold)]/30 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent border-2 border-[var(--color-gold)]/30 flex-shrink-0" />
              )}

              {/* Navn + melding */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-gold)] leading-tight mb-1">
                  {other?.name || "Ukjent"}
                </p>
                <p className={`text-sm leading-relaxed truncate ${hasUnread ? "text-[var(--color-text)] font-medium" : "text-[var(--color-muted)]"}`}>
                  {last?.imageUrl ? (
                    <span className="inline-flex items-center gap-2">
                      <img
                        src={last.imageUrl}
                        alt="Billemelding"
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="hidden sm:inline">Billemelding</span>
                    </span>
                  ) : (
                    <>{last?.text || "Ingen meldinger ennå"}</>
                  )}
                  {last?.senderId === c.users[0]?.id && last?.seen === true && (
                    <span className="text-green-500 ml-1">✓</span>
                  )}
                </p>
              </div>

              {/* Unread indicator */}
              {hasUnread && (
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)] flex-shrink-0" />
              )}
            </GlassCard>
          );
        })}
      </div>
    </FadeIn>
  );
}