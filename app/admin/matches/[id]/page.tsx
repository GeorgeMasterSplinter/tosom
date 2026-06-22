/**
 * ToSom — Admin Match Detalj
 * 
 * Server Component — viser full match med profiler side-by-side og AI-innsikt.
 */

import { getMatchById, getAllInsights } from '@/lib/admin/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminMatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) notFound();

  const allInsights = await getAllInsights(1, 100);
  const matchInsight = allInsights.find(i => i.matchId === id);

  const resonanceColor = (level: string) => {
    const colors: Record<string, string> = {
      DEEP: '#9C27B0',
      STRONG: '#D4AF37',
      MODERATE: '#3B82F6',
      GENTLE: 'rgba(255,255,255,0.5)',
    };
    return colors[level] || colors.GENTLE;
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link href="/admin/matches" className="text-sm transition-colors duration-200 w-fit" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Tilbake til matcher
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>Matchdetalj</h1>
          <span className="text-4xl font-bold" style={{ color: match.score >= 85 ? '#D4AF37' : match.score >= 70 ? '#E8C766' : 'rgba(255,255,255,0.5)' }}>{match.score}</span>
        </div>
      </div>

      {/* Basis */}
      <DetailSection title="Matchinformasjon">
        <InfoRow label="Match ID" value={match.id} monospace />
        <InfoRow label="Resonansnivå" value={<span className="text-sm font-semibold" style={{ color: resonanceColor(match.resonanceLevel) }}>{match.resonanceLevel}</span>} />
        <InfoRow label="Status" value={match.status} />
        <InfoRow label="Oppretta" value={new Date(match.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      {/* Brukarar side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brukar A */}
        <DetailSection title={`Brukar A — ${match.userAName}`}>
          <InfoRow label="ID" value={match.userAId} monospace />
          {match.userAProfile && (
            <>
              <InfoRow label="Namn" value={(match.userAProfile as any).identityName || 'Ukjent'} />
              <InfoRow label="Alder" value={(match.userAProfile as any).age?.toString() || '—'} />
            </>
          )}
        </DetailSection>

        {/* Brukar B */}
        <DetailSection title={`Brukar B — ${match.userBName}`}>
          <InfoRow label="ID" value={match.userBId} monospace />
          {match.userBProfile && (
            <>
              <InfoRow label="Namn" value={(match.userBProfile as any).identityName || 'Ukjent'} />
              <InfoRow label="Alder" value={(match.userBProfile as any).age?.toString() || '—'} />
            </>
          )}
        </DetailSection>
      </div>

      {/* Explanation */}
      {match.explanation && Object.keys(match.explanation).length > 0 && (
        <DetailSection title="AI-forklaring">
          <pre
            className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-96"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
          >
            {JSON.stringify(match.explanation, null, 2)}
          </pre>
        </DetailSection>
      )}

      {/* AI-innsikt */}
      {matchInsight && (
        <DetailSection title="AI-innsikt">
          <InfoRow label="Summary" value={matchInsight.summary} />
          <InfoRow label="Styrker" value={matchInsight.strengths} />
          <InfoRow label="Tydeleggjering" value={matchInsight.clarity} />
          <InfoRow label="Start-spørsmål" value={matchInsight.starter} />
          <InfoRow label="Model" value={matchInsight.model || '—'} />
          <InfoRow label="Token ut" value={matchInsight.tokensOut.toString()} />
        </DetailSection>
      )}

      {/* Raw */}
      <DetailSection title="Raw JSON">
        <pre
          className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-96"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
        >
          {JSON.stringify(match, null, 2)}
        </pre>
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 className="text-base font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.7)' }}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, monospace = false }: { label: string; value: React.ReactNode; monospace?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: monospace ? 'monospace' : 'inherit', whiteSpace: monospace ? 'pre-wrap' : 'normal', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}