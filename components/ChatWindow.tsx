// ═════════════════════════════════════════════════════════════════
// ⚠️  DEPRECATED — Use components/chat/ChatWindow.tsx instead
//
// This root ChatWindow is an older version. The canonical implementation
// lives at components/chat/ChatWindow.tsx
//
// TODO: Remove after Fase 2 cleanup.
// ══════════════════════════════════════════════════════════════════
"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./chat/ChatHeader";
import GlassPanel from "@/components/ui/panels/GlassPanel";
import GlassCard from "@/components/ui/cards/GlassCard";
import FadeIn from "@/components/ui/FadeIn";

type Message = {
  id: string;
  text?: string;
  imageUrl?: string;
  senderId: string;
  seen: boolean;
  createdAt: string; // ISO date string
};

type ChatWindowProps = {
  conversation: {
    id: string;
    messages: Message[];
    photosAllowed?: boolean;
  };
  partner: { name: string; age: number; image?: string };
  chatUntil: string;
  phaseLabel?: string;
  currentDay?: number;
  photosAllowed?: boolean;
  onClose?: () => void;
};

export default function ChatWindow({
  conversation,
  partner,
  chatUntil,
  phaseLabel = "EARLY",
  currentDay = 1,
  photosAllowed = true,
  onClose,
}: ChatWindowProps) {
  const [messages, setMessages] = useState(conversation.messages);
  const [timeLeft, setTimeLeft] = useState("");

  // reuse ChatHeader logic for time left
  useEffect(() => {
    function updateTime() {
      const end = new Date(chatUntil);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      if (days === 0) {
        setTimeLeft("Matchen avsluttes i dag");
      } else {
        setTimeLeft(`${days} dager igjen`);
      }
    }
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [chatUntil]);

  return (
    <GlassPanel className="flex flex-col gap-0 overflow-hidden">
      <ChatHeader
        partnerName={partner.name}
        phaseLabel={phaseLabel}
        currentDay={currentDay}
        photosAllowed={photosAllowed}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-[var(--space-md)]">
        <FadeIn>
          {messages.map((msg) => {
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isOwn = msg.senderId === partner.name;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-[var(--space-sm)]`}
              >
                <GlassCard
                  className={`max-w-[75%] px-4 py-3 ${
                    isOwn
                      ? "bg-[var(--color-gold)]/15 border-[var(--color-gold)]/30 rounded-tl-[16px] rounded-tr-[8px] rounded-bl-[16px] rounded-br-[8px]"
                      : "bg-[var(--color-card)] border-[var(--color-card-border)] rounded-tl-[8px] rounded-tr-[16px] rounded-bl-[8px] rounded-br-[16px]"
                  }`}
                >
                  {msg.text && (
                    <p className={`text-sm leading-relaxed ${isOwn ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
                      {msg.text}
                    </p>
                  )}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Sendt bilde"
                      className="w-full h-40 object-cover my-2 rounded-[16px] border border-white/10"
                    />
                  )}
                  <span className={`text-xs ${isOwn ? "text-[var(--color-gold)]/70" : "text-[var(--color-muted)]/70"} block mt-2`}>
                    {time}
                  </span>
                </GlassCard>
              </div>
            );
          })}
        </FadeIn>
      </div>
    </GlassPanel>
  );
}