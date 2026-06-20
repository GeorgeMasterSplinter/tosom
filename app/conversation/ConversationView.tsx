"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import SystemMessage from "@/components/conversation/SystemMessage";
import MessageBubble from "@/components/conversation/MessageBubble";
import TypingIndicator from "@/components/conversation/TypingIndicator";
import ContinueChoice from "@/components/conversation/ContinueChoice";
import MatchBanner from "@/components/match/MatchBanner";

export default function ConversationView({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [journey, setJourney] = useState<any>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [matchInfo, setMatchInfo] = useState<{ name: string; age: number; score: number; explanation: string } | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const refreshMessages = async () => {
    try {
      const res = await fetch(`/api/conversation/${conversationId}/messages`);
      const data = await res.json();
      setMessages(data.messages);
      setJourney(data.journey);
      setIsNewConversation(data.isNewConversation);

      if (data.journey?.userAId && data.journey?.userBId && currentUserId) {
        const userField = currentUserId === data.journey.userAId ? "continueA" : "continueB";
        setHasChosen(!!data.journey[userField]);
      }
    } catch {
      // Feilhåndtering er skjult for brukeren
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchInfo]);

  useEffect(() => {
    refreshMessages();
    setLoading(false);
  }, [conversationId]);

  async function sendMessage() {
    if (!input.trim()) return;

    const optimisticMessage = {
      id: "temp-" + Date.now(),
      senderId: currentUserId,
      content: input,
      type: "user",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    const toSend = input;
    setInput("");
    setSending(true);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1800);

    try {
      const res = await fetch(`/api/conversation/${conversationId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: toSend }),
      });

      if (!res.ok) throw new Error("Sending feila");

      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? data.message : m))
      );

      await refreshMessages();
    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );

      setInput(toSend);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950/80 backdrop-blur-sm py-4 z-10 border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-light text-white">Samtale</h1>
          <p className="text-gray-400 text-sm">Med din match</p>
        </div>
      </div>

      {/* Meldingsliste */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-4 py-4 space-y-10 pb-32 pt-4">
        {loading && (
          <div className="text-center text-gray-400 text-sm">Laster meldinger…</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            Ingen meldinger ennå.
          </div>
        )}

        {/* MatchBanner */}
        {!loading && matchInfo && showBanner && isNewConversation && (
          <div className="relative">
            <MatchBanner
              name={matchInfo.name}
              age={matchInfo.age}
              score={matchInfo.score}
              explanation={matchInfo.explanation}
              blocks={{ basic: 0, lifestyle: 0, interests: 0, location: 0, needs: 0, boundaries: 0, intentions: 0 }}
              onClose={() => setShowBanner(false)}
            />
          </div>
        )}

        {!loading &&
          messages.map((msg) =>
            msg.type === "system" ? (
              <SystemMessage key={msg.id} content={msg.content} />
            ) : (
              <MessageBubble key={msg.id} message={msg} />
            )
          )}

        {isTyping && <TypingIndicator />}

        {/* ContinueChoice */}
        {!loading && journey && journey.currentDay >= 30 && !hasChosen && journey.conversationId === conversationId && (
          <ContinueChoice
            onChoose={async (choice) => {
              await fetch(`/api/conversation/${conversationId}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "continue_choice", choice }),
              });
            }}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Inputfelt */}
      <div className="sticky bottom-0 bg-gray-950/80 backdrop-blur-sm py-4 z-10 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 flex gap-3">
          <input
            type="text"
            placeholder="Skriv en melding…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowBanner(false)}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="rounded-xl bg-white text-gray-900 font-medium px-4 py-3 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
