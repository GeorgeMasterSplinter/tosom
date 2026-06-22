'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const blogPosts = [
  {
    slug: 'kompatibilitet',
    title: 'Kvifor kompatibilitet betyr meir enn utseende',
    excerpt: 'Forskning viser at verdier, livssituasjon og emosjonelle mønstre er langt sterkare prediktorar for varige relasjonar enn overflate.',
    date: '15. januar 2026',
    readTime: '5 min',
  },
  {
    slug: 'reisetemaer',
    title: 'Kvifor 30 dagar er den perfekte tidsrammen',
    excerpt: 'Psykologar har observert at det tek omtrent 30 dagar for to menneske å bygge verktrueleg tillit og forbindelse.',
    date: '10. januar 2026',
    readTime: '4 min',
  },
  {
    slug: 'rolegheit',
    title: 'Kvifor rolegheit er vår viktigaste funksjon',
    excerpt: 'I ein verd der datingapper konstant konkurrerer om oppmerksomheita di, valde ToSom ein annan veg.',
    date: '5. januar 2026',
    readTime: '3 min',
  },
];

function GlassCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: color.glass.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${color.glass.border}`,
        borderRadius: `${radius.xl}px`,
        boxShadow: shadow.lg,
        padding: `${spacing.lg}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>ToSom Blogg</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Tankar om relasjonar,_matching, og rolegheit. Skrivne av ToSom-teamet.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {blogPosts.map((post, idx) => (
                <Link key={post.slug} href={`/blogg/${post.slug}`} className="block group">
                  <GlassCard className="transition-all duration-300 hover:border-white/15">
                    <div className="flex items-center gap-4 mb-4" style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="mb-4 transition-colors duration-300 group-hover:text-[#D4AF37]" style={{ ...typographyToStyle('heading-sm'), color: color.text.primary }}>
                      {post.title}
                    </h2>
                    <p style={{ ...typographyToStyle('body-sm'), color: color.text.secondary }}>
                      {post.excerpt}
                    </p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}