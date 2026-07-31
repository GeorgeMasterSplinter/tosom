"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import SystemMessage from "./SystemMessage";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ContinueChoice from "./ContinueChoice";
import JourneyTimeline from "./JourneyTimeline";
import JourneyEndNotice from "./JourneyEndNotice";

export default function ConversationView({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [journey, setJourney] = useState<any>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const refreshMessages = async () => {
    try {
      const res = await fetch(`/api/conversation/${conversationId}/messages`);
      const data = await res.json();
      setMessages(data.messages);
      setJourney(data.journey);

      // Sjekk om bruker allerede har valgt
      if (data.journey?.userAId && data.journey?.userBId && currentUserId) {
        const userField = currentUserId === data.journey.userAId ? "continueA" : "continueB";
        setHasChosen(!!data.journey[userField]);
      }
    } catch (err) {
      console.error("Failed to refresh messages", err);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    refreshMessages();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;

    const optimisticMessage = {
      id: "temp-" + Date.now(),
      senderId: currentUserId,
      content: input,
      type: "user",
    };

    // Optimistic UI
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

      if (!res.ok) throw new Error("Failed to send");

      const data = await res.json();

      // Erstatt optimistic med ekte melding
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? data.message : m))
      );

      // Hent oppdaterte meldinger fra server
      await refreshMessages();
    } catch (err) {
      console.error("Send failed", err);

      // Fjern optimistic message
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );

      // Sett input tilbake
      setInput(toSend);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E5E5E5] bg-white">
        <h1 className="text-[17px] font-medium">Samtale</h1>
      </div>

      {/* Meldingsliste */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading && (
          <div className="text-center text-[#777] text-[14px]">Laster meldinger…</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-[#777] text-[14px]">
            Ingen meldinger ennå.
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

        {/* JourneyTimeline / JourneyEndNotice: dag X av reisa eller moden reise */}
        {!loading && journey && (journey.currentDay ?? 0) > 35 ? (
          <JourneyEndNotice />
        ) : (
          <JourneyTimeline day={journey.currentDay ?? 0} />
        )}

        {/* ContinueChoice: vis på dag 30 hvis bruker ikke har valgt ennå */}
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
      <div className="border-t border-[#E5E5E5] bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Skriv en melding…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-[#DADADA] rounded-lg text-[15px] focus:outline-none"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-[15px] font-medium active:scale-[0.97] disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
