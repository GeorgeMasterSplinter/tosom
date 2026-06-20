/* ═══════════════════════════════════════════
   ToSom Premium — Chat List Page
   SectionHero + ChatList component
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/Section";
import { ChatList } from "@/components/chat/ChatList";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";

interface ConversationData {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
}

// Demo data — kan erstattes med API-kall
const demoConversations: ConversationData[] = [
  { id: "1", name: "Emma", lastMessage: "Det var hyggelig å møte deg!", timestamp: "12:30", unread: 2, online: true },
  { id: "2", name: "Sofia", lastMessage: "Hva gjør du på helga?", timestamp: "09:15", unread: 0 },
  { id: "3", name: "Astrid", lastMessage: "Ja, jeg holder med!", timestamp: "I går" },
  { id: "4", name: "Ingrid", lastMessage: "Takk for matcheringen 🤍", timestamp: "I går", online: true },
];

export default function ChatPage() {
  const router = useRouter();
  const [conversations] = useState<ConversationData[]>(demoConversations);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* SectionHero */}
        <SectionHeader
          badge="Chat"
          title="Dine samtaler"
          subtitle="Fortsett reisen deres"
        />

        {/* Chat List */}
        <Card variant="glass" className="p-4">
          <ChatList
            conversations={conversations}
            onSelect={(id) => router.push(`/chat/${id}`)}
          />
        </Card>
      </div>
    </div>
  );
}