/**
 * ToSom Dashboard 1.0 — Conversation Page
 * Full chat-visning med premium UI.
 */

'use client';

import { useDashboard } from '../context/DashboardContext';

export default function ConversationPage() {
  const { state } = useDashboard();

  const topic = state.conversationTopic ?? 'Ingen samtale startet ennå';
  const description = state.conversationDescription ?? 'Del ditt svar med din match.';
  const lastInteraction = state.lastInteraction ?? 'Ingen interaksjon ennå';

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Samtale
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          Utforsk dype spørsmål og refleksjoner sammen.
        </p>
      </div>

      {/* Samtale-info-kort */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card animate-subtlePop
      ">
        <h2 className="text-xl font-medium text-white">{topic}</h2>
        <p className="text-[var(--ts-text-soft)] mt-2">{description}</p>
        <p className="text-[var(--ts-text-soft)] text-sm mt-4">
          Siste interaksjon: {lastInteraction}
        </p>
      </div>

      {/* Chat-boble-liste */}
      <section className="space-y-4">
        {/* Partner-melding */}
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-4 max-w-[80%]
          text-[var(--ts-text)]
          ts-shadow-card animate-fadeIn
        ">
          <p className="text-sm text-[var(--ts-text-soft)] mb-1">Partneren din</p>
          <p>{state.lastMessagePreview || '…'}</p>
        </div>

        {/* Din melding */}
        <div className="
          bg-[var(--ts-gold-soft)]
          border border-[var(--ts-gold)]
          rounded-xl p-4 max-w-[80%] ml-auto
          text-[var(--ts-gold)]
          ts-shadow-gold animate-fadeIn
        ">
          <p className="text-sm opacity-75 mb-1">Du</p>
          <p>(placeholder)</p>
        </div>
      </section>

      {/* Typing-indikator */}
      {state.partnerTyping && (
        <p className="text-[var(--ts-text-soft)] text-sm animate-pulse">
          Partneren din skriver …
        </p>
      )}

      {/* Input-felt (placeholder) */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-xl p-4 ts-shadow-card
      ">
        <p className="text-[var(--ts-text-soft)]">
          Meldingsfelt kommer snart.
        </p>
      </div>
    </div>
  );
}