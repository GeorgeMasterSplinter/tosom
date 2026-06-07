type Conversation = {
  id: string;
  users: { id: string; name?: string; image?: string }[];
  messages: { id: string; text?: string; imageUrl?: string; senderId?: string; seen?: boolean }[];
};

import { useEffect, useState } from "react";
import FadeIn from "@/components/animations/FadeIn";

export default function ChatList({
  conversations,
  onSelect,
}: {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <FadeIn>
        {conversations.map((c) => {
          const other = c.users.find((u) => u.id !== c.users[0].id);
          const last = c.messages[0];

          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="w-full bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-4 text-left hover:bg-[#1E2A38]/80 transition-all duration-150 hover:shadow-[0_0_0_2px_rgba(203,170,122,0.3)]"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {other?.image ? (
                  <img
                    src={other.image}
                    alt={other.name || "Ukjent"}
                    className="w-10 h-10 rounded-full object-cover border border-[#CBAA7A]/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#CBAA7A]/10 border border-[#CBAA7A]/20 flex-shrink-0" />
                )}

                {/* Navn + melding */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light leading-tight text-[#CBAA7A] mb-1">
                    {other?.name || "Ukjent"}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600 truncate">
                    {last?.imageUrl ? (
                      <span className="inline-flex items-center gap-2">
                        <img
                          src={last.imageUrl}
                          alt="Billemelding"
                          className="w-6 h-6 rounded object-cover"
                        />
                        <span className="hidden sm:inline">Billemelding</span>
                      </span>
                    ) : (
                      <>{last?.text || "Ingen meldinger ennå"}</>
                    )}
                    {last?.senderId === c.users[0]?.id && last?.seen === true && (
                      <span className="text-green-500 ml-1">✓</span>
                    )}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </FadeIn>
    </div>
  );
}
