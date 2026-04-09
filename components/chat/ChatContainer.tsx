import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import BliKjentDrawer from "./BliKjentDrawer";
import { subscribeToMatchChannel } from "@/lib/realtime";

export default function ChatContainer({ matchId }) {
  const [messages, setMessages] = useState([]);
  const [match, setMatch] = useState(null);

  // Hent match-info (inkludert chatUntil)
  useEffect(() => {
    fetch(`/api/match/get?matchId=${matchId}`)
      .then((res) => res.json())
      .then(setMatch);
  }, [matchId]);

  // Hent meldingshistorikk
  useEffect(() => {
    fetch(`/api/chat/history?matchId=${matchId}`)
      .then((res) => res.json())
      .then(setMessages);
  }, [matchId]);

  // Realtime meldinger
  useEffect(() => {
    const unsubscribe = subscribeToMatchChannel(matchId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => unsubscribe && unsubscribe();
  }, [matchId]);

  if (!match) {
    return <div className="p-4 text-neutral-400">Laster…</div>;
  }

  const chatLocked = new Date(match.chatUntil) < new Date();

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">
      <ChatHeader matchId={matchId} />

      {chatLocked && (
        <div className="bg-neutral-900 text-neutral-300 p-3 text-center text-sm border-b border-neutral-800">
          Chatten er nå avsluttet.  
          Dere kan lese meldinger, men ikke sende nye.  
          Gå til dashboardet for å ta et valg.
        </div>
      )}

      <MessageList messages={messages} />
      <BliKjentDrawer matchId={matchId} />

      {!chatLocked && <ChatInput matchId={matchId} />}
    </div>
  );
}
