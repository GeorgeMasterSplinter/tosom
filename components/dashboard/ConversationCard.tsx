"use client";

import JourneySummary from "./JourneySummary";

export default function ConversationCard({
  partnerName = "Person",
  lastMessage = "Ingen meldingar enno",
  timeAgo,
  journey,
  hasUnreadMessages,
  partnerLastActive,
}: {
  partnerName?: string;
  lastMessage?: string;
  timeAgo?: string;
  journey?: { day: number };
  hasUnreadMessages?: boolean;
  partnerLastActive?: string;
}) {
  const day = journey?.day;

  return (
    <li className="bg-white rounded-xl border border-[#CBAA7A]/20 p-4 space-y-2 flex items-start cursor-pointer hover:bg-[#1A1A1A]/5 transition-colors group">
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium text-[#1A1A1A] leading-relaxed">{partnerName}</p>
        {hasUnreadMessages && (
          <p className="text-xs text-[#C75B39] leading-relaxed">
            Ulest melding
          </p>
        )}
        {day != null && day > 0 && day <= 35 && (
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Dag {day} av reisa
          </p>
        )}
        {day != null && day > 35 && (
          <p className="text-xs text-[#CBAA7A] leading-relaxed">
            Moden reise
          </p>
        )}
        {partnerLastActive && (
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Sist aktiv for {partnerLastActive} sidan
          </p>
        )}
        <p className="text-[#4A4A4A] text-sm leading-relaxed truncate" title={lastMessage}>
          {lastMessage}
        </p>
        <p className="text-[#4A4A4A] text-sm leading-relaxed">
          {timeAgo || "Nylig"}
        </p>
        {day != null && (
          <JourneySummary
            journeyText={day > 35 ? "Moden reise" : `Dag ${day} av reisa`}
            journeyStatus="in_progress"
          />
        )}
      </div>
      <div className="flex-shrink-0">
        <svg
          className="w-4 h-4 text-[#4A4A4A]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M16.71 13.29a1 1 0 01-1.42 0l-4.38-4.38a1 1 0 010-1.42l4.38-4.38a1 1 0 011.42 1.42l-4.38 4.38a1 1 0 010 1.42z" />
        </svg>
      </div>
    </li>
  );
}
