'use client';

import { FC } from 'react';

interface PageProps {}

export const KviforPage: FC<PageProps> = () => {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* Hero */}
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-[-0.02em] mb-8">
          Kvifor ToSom?
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7] mb-6">
          Datingmarkedet er brukt av selskap som tjenar på at du forblir aleine. Dei vil ha så mange brukarar som mogleg, så lenge dei ikkje finn nokon.
        </p>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-6 leading-[1.7]">
          ToSom er annleises. Vi tjenar berre når du finn din person. Vårt motiv er derfor heilt annleises — og det pregar kvar eining på plattformen.
        </p>
      </section>

      {/* Innhald */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-base text-white/60 leading-[1.8]">
            [Innhald kjem]
          </p>
        </div>
      </section>
    </main>
  );
};

export default KviforPage;