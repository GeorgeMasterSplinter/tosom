/* ═══════════════════════════════════════════
   ToSom Premium — Chat Detail Page
   Full ChatWindow component with gradient background
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";

interface MessageData {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

// Demo data — kan erstattes med API-kall
const demoMessages: MessageData[] = [
  { id: "1", text: "Hei! Hvordan har du det?", sender: "them", timestamp: "12:00" },
  { id: "2", text: "Jeg har det fint, takk! Du?", sender: "me", timestamp: "12:05" },
  { id: "3", text: "Bra! Syns matchen vår var kul 😊", sender: "them", timestamp: "12:10" },
  { id: "4", text: "Ja, resonance score var høy!", sender: "me", timestamp: "12:15" },
];

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params?.id as string;
  const [messages, setMessages] = useState<MessageData[]>(demoMessages);

  const handleSend = (text: string) => {
    const newMessage: MessageData = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date().toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827]">
      <div className="max-w-4xl mx-auto h-full p-4">
        <ChatWindow
          contactName={`Bruker ${chatId}`}
          messages={messages}
          onSend={handleSend}
          online
        />
      </div>
    </div>
  );
}