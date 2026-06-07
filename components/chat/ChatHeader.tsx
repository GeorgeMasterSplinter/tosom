"use client";

/** ChatHeader — tittelstripe øvst i ChatPanel
 *  CF45 — partner-navn, fase-status, dagnummer, lukk-knapp */

interface ChatHeaderProps {
  partnerName?: string;
  phaseLabel: string;
  currentDay: number;
  photosAllowed: boolean;
  onClose?: () => void;
}

export default function ChatHeader({
  partnerName = "Makei",
  phaseLabel,
  currentDay,
  photosAllowed,
  onClose,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 border-b border-black/5">
      <div className="flex items-center gap-3">
        {/* Avatar-cirkel */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200/60 to-emerald-200/60 flex items-center justify-center text-sm font-medium text-[#4A4A4A]/80">
          {partnerName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-[#4A4A4A]">{partnerName}</p>
          <p className="text-xs text-[#4A4A4A]/50">
            {phaseLabel} · dag {currentDay}
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4A4A4A]/40 hover:bg-black/5 hover:text-[#4A4A4A]/70 transition-colors"
          aria-label="Lukk"
        >
          ✕
        </button>
      )}
    </div>
  );
}
