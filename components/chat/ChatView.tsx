"use client";

import ChatMessageBubble from "./ChatMessageBubble";
import { type ChatState } from "../../lib/chat/chatFlow";

/** ChatView – chatvindauge med scroll, meldinger, input og lås
 *  CF21 — Layout: full height, scroll-y, space-y-4, bg-white/60, p-4
 *  CF22 — Props: chatState: ChatState
 *  CF23 — Vis meldinger: map over chatState.messages
 *  CF24 — Inputfelt: vis bare når chatLocked=false
 *  CF25 — Placeholder-tekst: "Skriv ein melding…"
 *  CF26 — Systemmeldinger i chat (via ChatMessageBubble)
 *  CF27 — Eigne meldinger: til høgre, E6F3EC
 *  CF28 — Partner-meldinger: til venstre, F7F1E3
 *  CF29 — Scroll til bunn: TODO-kommentar
 *  CF30 — Ingen interaktiv logikk — bare UI
 *  CF38 — Bokmål, varmt, rolegt, kort */

export default function ChatView({ chatState }: { chatState: ChatState }) {
  return (
    <div className="bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] rounded-xl overflow-hidden flex flex-col h-[500px]">
      {/* Meldingsliste */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40">
        {chatState.messages.length === 0 && (
          <p className="text-xs text-[#4A4A4A]/60 text-center py-8">
            Enn så lenge er det ingen meldinger her.
          </p>
        )}

        {chatState.messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {/* CF29 — Scroll til bunn når meldinger oppdaterast */}
        {/* TODO: Scroll til bunn når meldinger oppdaterast. */}
      </div>

      {/* Bunn: lås eller input */}
      <div className="border-t border-black/5 p-3 bg-white/40">
        {chatState.chatLocked ? (
          <p className="text-xs text-[#4A4A4A]/70 text-center">
            Chatten er låst.
          </p>
        ) : (
          <div className="flex items-center gap-2">
            {/* CF35 — Bilder-status */}
            {chatState.photosAllowed && (
              <span className="text-xs text-[#4A4A4A]/60">
                Bilder er opne.
              </span>
            )}
            {!chatState.photosAllowed && chatState.currentDay > 0 && (
              <span className="text-xs text-[#4A4A4A]/60">
                Bilder er låst i denne fasen.
              </span>
            )}
            <input
              type="text"
              placeholder="Skriv ein melding…"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#4A4A4A]/40"
            />
            <button className="text-xs px-3 py-1.5 rounded-lg bg-[#E6F3EC] text-[#2F4538] hover:bg-opacity-90 transition-colors">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
