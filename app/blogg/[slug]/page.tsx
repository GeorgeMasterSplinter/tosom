'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';
import { useParams } from 'next/navigation';

const blogPosts = {
  'kompatibilitet': {
    title: 'Kvifor kompatibilitet betyr meir enn utseende',
    date: '15. januar 2026',
    readTime: '5 min lesing',
    content: `
      <p>I eit samfunn der vi konstant blir eksponert for bilder og overflatefokus, er det lett å glemtje hva som faktisk betyr noko i ein relasjon.</p>
      
      <p>Forskning viser at kompatibilitet basert på verdier, livssituasjon og emosjonelle mønstre er langt sterkare prediktorar for varige relasjonar enn utseende.</p>
      
      <p>ToSom vel å fokusere på det som faktisk skaper varig forbindelse. Når to menneske møter hverandre på et dypere plan, blir overflateikke det første — det blir det siste.</p>
      
      <p>Vår match-motor måler kompatibilitet gjennom resonans — hvordan to menneske faktisk føles saman, ikke hvordan dei ser ut.</p>
    `,
  },
  'reisetemaer': {
    title: 'Kvifor 30 dagar er den perfekte tidsrammen',
    date: '10. januar 2026',
    readTime: '4 min lesing',
    content: `
      <p>Psykologar har observert at det tek omtrent 30 dagar for to menneske å bygge verktrueleg tillit og forbindelse.</p>
      
      <p>Den fyrsteuka handlar om å identifisere hverandre. Den andreuka handlar om sårbarheit. Den tredje uka handlar om djupe samtalar. Og den fjerde uka handlar om felles framtid.</p>
      
      <p>30 dagar er ikke for lang tid — det er nøyaktig den tida som trengst for to menneske å bli kjende på eit nivå som faktisk betyr noko.</p>
      
      <p>ToSoms guiderte reise er designa for å støtte denne prosessen med daglege refleksjonar, samtaletema og oppgåver.</p>
    `,
  },
  'rolegheit': {
    title: 'Kvifor rolegheit er vår viktigaste funksjon',
    date: '5. januar 2026',
    readTime: '3 min lesing',
    content: `
      <p>I ein verd der datingapper konstant konkurrerer om oppmerksomheita di med push-notifikasjonar og gamification, valde ToSom ein annan veg.</p>
      
      <p>Vi trur at rolegheit er den viktigaste funksjonen på heile plattformen. Ingen swipe. Ingen feed. Ingen press.</p>
      
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
          <h1 className="mb-4" style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>Artikkelen blei ikke funnet</h1>
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