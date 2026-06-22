"use client";

import { type ChatMessage as ChatMessageType } from "../../lib/chat/chatFlow";

/** ChatMessageBubble – viser éin chatmelding i chatvindauget
 *  CF27 — Eigne meldinger (me): til høgre, E6F3EC
 *  CF28 — Partner-meldinger: til venstre, F7F1E3
 *  CF26 — Systemmeldinger: E7EEF4 med ikon
 *  CF38 — Bokmål, varmt, roligt, kort */

const senderConfig = {
  me: {
    bg: "bg-[#E6F3EC]/80",
    align: "self-end",
    icon: "✓",
  },
  partner: {
    bg: "bg-[#F7F1E3]/80",
    align: "self-start",
    icon: "–",
  },
  system: {
    bg: "bg-[#E7EEF4]/80",
    align: "self-center",
    icon: "ℹ️",
  },
};

export default function ChatMessageBubble({ message }: { message: ChatMessageType }) {
  const config = senderConfig[message.sender];
  const levelIcon = message.systemLevel
    ? message.systemLevel === "info"
      ? "ℹ️"
      : message.systemLevel === "success"
      ? "✓"
      : "⚠️"
    : config.icon;

  return (
    <div className={`flex ${config.align} gap-2 max-w-[80%]`}>
      <div
        className={`${config.bg} ${message.sender === 'me' ? 'rounded-tl-[16px] rounded-tr-[8px] rounded-bl-[16px] rounded-br-[8px]' : 'rounded-tl-[8px] rounded-tr-[16px] rounded-bl-[8px] rounded-br-[16px]'} p-3 text-sm leading-relaxed text-[#4A4A4A] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:opacity-95 transition-opacity`}
      >
        {/* Systemikon for systemmeldinger */}
        {message.sender === "system" && (
          <span className="text-xs mr-1 leading-none">{levelIcon}</span>
        )}
        <p className="leading-relaxed">{message.body}</p>
        <p className="text-xs text-[#4A4A4A]/60 mt-1">{message.timestamp}</p>
      </div>
    </div>
  );
}
