'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';
import { useParams } from 'next/navigation';

const blogPosts = {
  'kompatibilitet': {
    title: 'Hvorfor det som er dypere enn utseende, betyr mer',
    date: '15. juni 2026',
    readTime: '5 min lesing',
    content: `
      <p>I et samfunn der vi konstant blir eksponert for bilder og overflatefokus, er det lett å glemme hva som faktisk betyr noe i en relasjon.</p>

      <p>Tosom er bygget rundt ideen om at verdier, livssituasjon og emosjonelle mønstre betyr mer for en varig relasjon enn det ytre. Det er ikke en vitenskapelig konklusjon — det er et syn vi har valgt, og det former hele produktet.</p>

      <p>Derfor starter reisen med ord, ikke bilder. Når to mennesker møtes på et dypere plan, blir overflaten det siste dere ser — ikke det første.</p>

      <p>Matchingen vår ser på hva dere verdsetter, hvordan dere holder hverandre nær og hvordan dere håndterer det vanskelige. Ikke hvordan dere ser ut.</p>
    `,
  },
  'reisetemaer': {
    title: 'Hvorfor reisen varer 30 dager',
    date: '20. juni 2026',
    readTime: '4 min lesing',
    content: `
      <p>Tretti dager er ikke en vitenskapelig standard, og vi påstår ikke at forskning har fastslått en «perfekt» tidsramme for å bygge tillit. Det er et bevisst designvalg — og vi vil være ærlige om at akkurat det er det.</p>

      <p>Det vi forsøkte å oppnå med lengden: kort nok til at dere ikke mister tråden, og lang nok til at samtalen faktisk kan bli dyp. Den første uken handler om å bli kjent. Den andre om sårbarhet. Den tredje om dype samtaler. Den fjerde om felles framtid.</p>

      <p>30 dager er derfor ikke en grense dere skal rekke — det er et rom dere får. Trenger dere mer tid, fortsetter dere på egne premisser.</p>

      <p>Reisen er designet for å støtte nettopp denne prosessen med daglige refleksjoner, samtaletema og små oppgaver — i eget tempo, uten press.</p>
    `,
  },
  'rolegheit': {
    title: 'Hvorfor ro er vår viktigste funksjon',
    date: '24. juni 2026',
    readTime: '3 min lesing',
    content: `
      <p>I en verden der datingapper konstant konkurrerer om oppmerksomheten din med push-notifikasjoner og gamification, har Tosom valgt en annen vei.</p>

      <p>Vi tror at ro er den viktigste funksjonen på hele plattformen. Ingen sveiping. Ingen feed. Ingen press.</p>

      <p>Når du fjerner all støy, kommer det ekte tilbake. Folk blir seg selv. Samtalene blir dypere. Forbindelsen blir ekte.</p>

      <p>Ro er ikke bare et estetisk valg — det er et grunnleggende designprinsipp.</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0B1520' }}>
        <div className="text-center">
          <h1 className="mb-4" style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>Artikkelen ble ikke funnet</h1>
          <Link href="/blogg" style={{ ...typographyToStyle('body'), color: color.brand.gold }}>
            Tilbake til bloggen
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
          <Link href="/blogg" style={{ ...typographyToStyle('body-sm'), color: color.brand.gold, marginBottom: '24px', display: 'inline-block' }}>
            ← Tilbake til bloggen
          </Link>
          <h1 className="mb-4" style={typographyToStyle('heading-lg')}>{post.title}</h1>
          <div className="flex items-center gap-4 mb-12" style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <div className="prose prose-invert max-w-none" style={{ ...typographyToStyle('body'), color: color.text.secondary, lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <Footer />
      </div>
    </main>
  );
}