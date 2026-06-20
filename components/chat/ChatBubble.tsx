/* ═══════════════════════════════════════════
   ToSom Premium — ChatBubble Component
   Premium chat message bubble with gold/white variants
   ═══════════════════════════════════════════ */

"use client";

import { FadeInUp } from "@/components/ui/FadeIn";

interface ChatBubbleProps {
  message: string;
  sender: "me" | "them";
  timestamp?: string;
  index?: number;
}

export const ChatBubble = ({
  message,
  sender,
  timestamp,
  index = 0,
}: ChatBubbleProps) => {
  const isMe = sender === "me";

  return (
    <FadeInUp duration={300} delay={index * 50}>
      <div
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}
      >
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            isMe
              ? "bg-[var(--ts-gold)]/15 text-white border border-[var(--ts-gold)]/25 rounded-br-sm"
              : "bg-white/[0.06] text-white/80 border border-white/8 rounded-bl-sm"
          } transition-all duration-200`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>
          {timestamp && (
            <p
              className={`mt-1.5 text-[11px] ${
                isMe ? "text-white/40" : "text-white/30"
              }`}
            >
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </FadeInUp>
  );
};

export default ChatBubble;