"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./chat/ChatHeader";
import FadeIn from "@/components/animations/FadeIn";

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
    <div className="w-full border-b border-neutral-200 bg-white">
      <ChatHeader
        partnerName={partner.name}
        phaseLabel={phaseLabel}
        currentDay={currentDay}
        photosAllowed={photosAllowed}
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <FadeIn>
          {messages.map((msg) => {
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isOwn = msg.senderId === partner.name;
            const bubbleClass = "bg-[#1E2A38]/80 p-3 rounded-xl mb-2";
            const ownBubbleClass = "bg-[#CBAA7A]/80 p-3 rounded-xl align-self-end";

            return (
              <div
                key={msg.id}
                className={`${bubbleClass} ${isOwn ? "justify-end" : "justify-start"}`}
              >
                {msg.text && (
                  <p className="text-sm text-neutral-900">{msg.text}</p>
                )}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Sent image"
                    className="w-full h-40 object-cover my-2 rounded"
                  />
                )}
                <span className="text-xs text-neutral-500 block mt-1">
                  {time}
                </span>
              </div>
            );
          })}
        </FadeIn>
      </div>
    </div>
  );
}
