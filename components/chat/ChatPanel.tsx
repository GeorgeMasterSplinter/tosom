"use client";

/** ChatPanel — fullskjerm/ halvskjerms chatmodul
 *  CF41 — plassering: components/chat/
 *  CF42 — props: chatState, onSendMessage, onClose
 *  CF43 — layout: h-full, bg-white/70, rounded-xl, shadow, flex-col, overflow-hidden
 *  CF44 — struktur: ChatHeader + ChatView + ChatInputBar
 *  CF47 — integrer ChatView i midten
 *  CF48 — fasebanner (photosAllowed)
 *  CF49 — journeyCompleted-banner
 *  CF50 — ingen interaktiv logikk */

import ChatHeader from "./ChatHeader";
import ChatView from "./ChatView";
import ChatInputBar from "./ChatInputBar";
import { type ChatState } from "../../lib/chat/chatFlow";

interface ChatPanelProps {
  chatState: ChatState;
  partnerName?: string;
  onSendMessage?: (text: string) => void;
  onClose?: () => void;
}

export default function ChatPanel({
  chatState,
  partnerName = "Makei",
  onSendMessage,
  onClose,
}: ChatPanelProps) {
  /* CF48 — fasebanner */
  const phaseLabel = chatState.photosAllowed
    ? "Bilder åpne"
    : "Uten bilder";

  return (
    <div className="h-full flex flex-col bg-white/70 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <ChatHeader
        partnerName={partnerName}
        phaseLabel={phaseLabel}
        currentDay={chatState.currentDay}
        photosAllowed={chatState.photosAllowed}
        onClose={onClose}
      />

      {/* CF49 — JourneyCompleted-banner */}
      {chatState.journeyCompleted && (
        <div className="px-4 py-2 bg-amber-100/60 border-b border-amber-200/40">
          <p className="text-xs text-amber-800/80 text-center">
            Reisen er ferdig. Chatten er låst.
          </p>
        </div>
      )}

      {/* ChatView — scroll-område i midten */}
      <div className="flex-1 overflow-hidden">
        <ChatView chatState={chatState} />
      </div>

      {/* ChatInputBar nederst (hvis ikke låst) */}
      <ChatInputBar
        chatLocked={chatState.chatLocked}
        photosAllowed={chatState.photosAllowed}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
