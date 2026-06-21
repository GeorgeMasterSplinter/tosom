/**
 * ToSom Dashboard 1.0 — AI Insights
 * Premium side med AI-genererte innsikter og anbefalinger.
 */

'use client';

const insights = {
  emotionalTone: 'Rolig og trygg',
  connectionLevel: 'Styrkende',
  conversationDepth: 'Dyp og reflektert',
  summary:
    'Dere viser en stabil og trygg kommunikasjon. Samtalene deres har vært preget av ærlighet og gjensidig nysgjerrighet.',
  recommendations: [
    'Still et spørsmål som inviterer til sårbarhet.',
    'Del en liten personlig historie du ikke har delt før.',
    'Utforsk et tema dere ikke har snakket om tidligere.',
  ],
};

export default function InsightsPage() {
  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          AI-innsikt
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En varm analyse av deres kommunikasjon og utvikling.
        </p>
      </div>

      {/* AI-oppsummering-kort */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card animate-subtlePop
      ">
        <h2 className="text-xl font-medium text-white mb-3">
          Oppsummering
        </h2>
        <p className="text-[var(--ts-text)] leading-[1.7]">
          {insights.summary}
        </p>
      </div>

      {/* Emosjonelle signaler */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Emosjonell tone</p>
          <p className="text-[var(--ts-text)] text-xl font-medium mt-1">
            {insights.emotionalTone}
          </p>
        </div>

        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Forbindelsesnivå</p>
          <p className="text-[var(--ts-text)] text-xl font-medium mt-1">
            {insights.connectionLevel}
          </p>
        </div>

        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Samtaledybde</p>
          <p className="text-[var(--ts-text)] text-xl font-medium mt-1">
            {insights.conversationDepth}
          </p>
        </div>
      </section>

      {/* Anbefalinger */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Anbefalinger</h2>
        <ul className="space-y-4">
          {insights.recommendations.map((rec, i) => (
            <li
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-4 ts-shadow-card animate-fadeIn
              "
            >
              <p className="text-[var(--ts-text)]">{rec}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}