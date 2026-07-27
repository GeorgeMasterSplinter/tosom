/* ═══════════════════════════════════════════
   ToSom Premium — MatchDetailModal Component
   ModalV2-basert overlay med match info
   ═══════════════════════════════════════════ */

"use client";

import { ModalV2 } from "@/components/ui/ModalV2";
import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { ResonanceMeter } from "@/components/ui/ResonanceMeter";
import { FadeIn } from "@/components/ui/FadeIn";

interface MatchDetail {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  location?: string;
  bio?: string;
  resonanceScore: number;
  interests: string[];
}

interface MatchDetailModalProps {
  match: MatchDetail;
  isOpen: boolean;
  onClose: () => void;
  onChat?: () => void;
}

export const MatchDetailModal = ({
  match,
  isOpen,
  onClose,
  onChat,
}: MatchDetailModalProps) => {
  return (
    <ModalV2
      open={isOpen}
      onClose={onClose}
      title={match.name}
      size="lg"
    >
      <FadeIn duration={400}>
        <div className="flex flex-col items-center gap-6 py-2">
          {/* Avatar */}
          <Avatar
            src={match.avatar}
            size="xl"
            className="shadow-[0_0_40px_rgba(212,175,55,0.2)] border-2 border-[var(--ts-gold)]/40"
          />

          {/* Info */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">
              {match.name}
              <span className="ml-2 text-lg text-white/60">{match.age}</span>
            </h3>
            {match.location && (
              <p className="text-sm text-white/40 mt-0.5">{match.location}</p>
            )}
          </div>

          {/* ResonanceMeter */}
          <ResonanceMeter value={match.resonanceScore ?? 0} size="lg" />

          {/* Bio */}
          {match.bio && (
            <div className="w-full px-2">
              <h4 className="text-sm font-medium text-white/60 mb-2">Om meg</h4>
              <p className="text-sm text-white/50 leading-relaxed bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3">
                {match.bio}
              </p>
            </div>
          )}

          {/* Interesser */}
          {match.interests.length > 0 && (
            <div className="w-full px-2">
              <h4 className="text-sm font-medium text-white/60 mb-2">Interesser</h4>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--ts-gold)]/10 text-[var(--ts-gold)] border border-[var(--ts-gold)]/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 w-full px-2">
            {onChat && (
              <Button variant="primary" onClick={onChat} className="flex-1">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start chat
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Lukk
            </Button>
          </div>
        </div>
      </FadeIn>
    </ModalV2>
  );
};

export default MatchDetailModal;