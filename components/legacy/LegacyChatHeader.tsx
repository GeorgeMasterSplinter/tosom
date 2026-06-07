// LegacyChatHeader — utdatert chat-header (countdown-basert)
// Den moderne varianten finn du i components/chat/ChatHeader.tsx
// Denne fila er oppretta for å unngå navnekonflikt med components/chat/ChatHeader.tsx.

"use client";

import { useEffect, useState } from "react";

export default function LegacyChatHeader({ partner, chatUntil }) {
  const [timeLeft, setTimeLeft] = useState("");

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
    <div className="w-full border-b border-neutral-200 bg-white p-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-medium text-neutral-900">
          {partner.name}, {partner.age}
        </div>
        <div className="text-neutral-500 text-sm">
          {timeLeft}
        </div>
      </div>
    </div>
  );
}
