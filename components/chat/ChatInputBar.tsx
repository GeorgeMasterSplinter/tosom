"use client";

/** ChatInputBar — inndata-bunnstripe i ChatPanel
 *  CF46 — inputfelt + send-knapp, eller låst-tekst */

import { useState } from "react";

interface ChatInputBarProps {
  chatLocked?: boolean;
  photosAllowed?: boolean;
  onSendMessage?: (text: string) => void;
}

export default function ChatInputBar({
  chatLocked = false,
  photosAllowed = false,
  onSendMessage,
}: ChatInputBarProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || chatLocked) return;
    onSendMessage?.(text.trim());
    setText("");
  };

  if (chatLocked) {
    return (
      <div className="px-4 py-3 bg-white/60 border-t border-black/5">
        <p className="text-xs text-[#4A4A4A]/60 text-center">
          Chatten er låst.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-white/60 border-t border-black/5">
      {/* Foto-banner */}
      {!photosAllowed && (
        <p className="text-xs text-[#4A4A4A]/50 mb-2 text-center">
          Bilder er låst i denne fasen.
        </p>
      )}
      {photosAllowed && (
        <p className="text-xs text-[#4A4A4A]/50 mb-2 text-center">
          Bilder er åpne.
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Skriv en melding…"
          className="flex-1 text-sm bg-white/80 rounded-lg px-3 py-2 border border-black/5 outline-none placeholder:text-[#4A4A4A]/40 focus:border-emerald-300/60 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-4 py-2 text-sm rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
