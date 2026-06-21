/**
 * ToSom Dashboard 1.0 — Weekly Summary
 * Premium ukesoppsummering med refleksjoner, progresjon og kommende steg.
 */

'use client';

const summary = {
  week: 'Uke 24',
  progress: 12,
  reflectionsCompleted: 4,
  milestonesReached: 1,
  highlight: 'Dere har hatt flere dype samtaler og nådd en viktig milepæl.',
  upcoming: [
    'Dag 13 – Utforsk verdier',
    'Dag 14 – Del en personlig historie',
    'Dag 15 – Fremtidsdrømmer',
  ],
};

export default function SummaryPage() {
  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Ukesoppsummering
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En varm oppsummering av reisen deres denne uken.
        </p>
      </div>

      {/* Ukesoppsummering-kort */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card animate-subtlePop
      ">
        <p className="text-[var(--ts-text-soft)] text-sm mb-2">
          {summary.week}
        </p>
        <h2 className="text-xl font-medium text-white mb-3">
          Høydepunkt
        </h2>
        <p className="text-[var(--ts-text)] leading-[1.7]">
          {summary.highlight}
        </p>
      </div>

      {/* Statistikk-kort */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Progresjon</p>
          <p className="text-[var(--ts-text)] text-2xl font-semibold mt-1">
            {summary.progress}/30
          </p>
        </div>

        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Refleksjoner</p>
          <p className="text-[var(--ts-text)] text-2xl font-semibold mt-1">
            {summary.reflectionsCompleted}
          </p>
        </div>

        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card text-center
        ">
          <p className="text-[var(--ts-text-soft)] text-sm">Milepæler</p>
          <p className="text-[var(--ts-text)] text-2xl font-semibold mt-1">
            {summary.milestonesReached}
          </p>
        </div>
      </section>

      {/* Kommende uke */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Neste uke</h2>
        <ul className="space-y-4">
          {summary.upcoming.map((step, i) => (
            <li
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-4 ts-shadow-card animate-fadeIn
              "
            >
              <p className="text-[var(--ts-text)]">{step}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}