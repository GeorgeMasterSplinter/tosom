/**
 * Tosom Dashboard 1.0 — DashboardConversation
 * Viser dagens samtaletema og forslag til dybdeskommunikasjon.
 * Context-drevet via useDashboard().
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useDashboard } from '../context/DashboardContext';

export const DashboardConversation: FC = () => {
  const { state } = useDashboard();

  // Loading
  if (state.loading) {
    return <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] h-32 animate-pulse mb-10" />;
  }

  // Error
  if (state.error) {
    return <p className="text-red-400 mb-10">{state.error}</p>;
  }

  // Tomtilstand: ingen samtale ennå
  if (!state.conversationTopic) {
    return (
      <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
          Samtale
        </h2>
        <p className="text-lg text-[var(--ts-text-soft)] leading-[1.7]">
          Ingen samtale startet ennå. Din første samtale vil dukke opp her.
        </p>
      </div>
    );
  }

  const topic = state.conversationTopic;
  const description = state.conversationDescription ?? 'Del ditt svar med din match.';
  const lastInteraction = state.lastInteraction;
  const primaryCTA = 'Fortsett samtalen';
  const primaryCTAHref = '/conversation';

  return (
    <div className="w-full rounded-2xl bg-[var(--ts-bg-soft)] border-[var(--ts-border)] p-8 md:p-10 space-y-6 mb-10 hover:bg-[var(--ts-bg-hover)] hover:border-[var(--ts-border-strong)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--ts-gold)]/40 focus:outline-none ts-shadow-card animate-subtlePop">
      {/* Seksjonstittel */}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white">
        Samtale
      </h2>

      {/* Undertekst */}
      <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md">
        Dagens forslag til meningsfull dialog.
      </p>

      {/* Samtale-tittel */}
      <div>
        <p className="text-xl md:text-2xl font-medium tracking-tight text-[var(--ts-text)] mb-2">
          {topic}
        </p>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] max-w-md text-sm">
          {description}
        </p>
      </div>

      {/* Siste melding fra partner */}
      {state.lastMessagePreview && (
        <p className="text-[var(--ts-text-soft)] text-sm italic animate-fadeIn max-w-md">
          {state.lastMessagePreview}
        </p>
      )}

      {/* Siste interaksjon */}
      {lastInteraction && (
        <div>
          <p className="text-xs text-[var(--ts-text-soft)] leading-[1.6] mb-2">
            {lastInteraction}
          </p>
        </div>
      )}

      {/* Typing-indikator */}
      {state.partnerTyping && (
        <div className="text-gray-400 text-sm animate-pulse">
          Partneren din skriver …
        </div>
      )}

      {/* CTA */}
      <div className="pt-2">
        <Link
          href={primaryCTAHref}
          className="btn-cta-primary inline-block"
        >
          {primaryCTA}
        </Link>
      </div>
    </div>
  );
};

export default DashboardConversation;