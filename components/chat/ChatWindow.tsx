/* ═══════════════════════════════════════════
   ToSom Premium — ChatWindow Component
   Full chat window with header, messages, and input
   ═══════════════════════════════════════════ */

"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/chat/ChatBubble";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

interface ChatWindowProps {
  contactName: string;
  contactAvatar?: string;
  messages?: Message[];
  onSend?: (text: string) => void;
  online?: boolean;
}

export const ChatWindow = ({
  contactName,
  contactAvatar,
  messages = [],
  onSend,
  online,
}: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend?.(input.trim());
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8 bg-white/[0.02] backdrop-blur-xl">
        <Avatar src={contactAvatar} size="md" />
        <div className="flex-1">
          <h3 className="text-white font-medium">{contactName}</h3>
          <p className="text-xs text-white/40 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-green-400" : "bg-white/20"}`} />
            {online ? "Online" : "Utilgjengelig"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Avatar size="xl" fallback="?" className="mb-4 opacity-20" />
            <p className="text-white/30 text-sm">Ingen meldinger ennå</p>
            <p className="text-white/20 text-xs mt-1">Skriv en melding for å starte samtalen</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp}
              index={i}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/8 bg-white/[0.02] backdrop-blur-xl px-4 md:px-6 py-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv en melding..."
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm focus:border-[var(--ts-gold)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] focus:outline-none transition-all duration-200"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;