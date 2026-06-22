/**
 * ToSom — Admin Innsikt Detalj
 * 
 * Server Component — viser full AI-innsikt med match-info.
 */

import { getInsightById } from '@/lib/admin/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminInsightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const insight = await getInsightById(id);

  if (!insight) notFound();

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link href="/admin/insights" className="text-sm transition-colors duration-200 w-fit" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Tilbake til innsikter
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#9C27B0' }}>AI-innsikt</h1>
      </div>

      {/* Match-info */}
      <DetailSection title="Match">
        <InfoRow label="Match ID" value={insight.match.id} monospace />
        <InfoRow label="Brukar A" value={insight.match.userAName} />
        <InfoRow label="Brukar B" value={insight.match.userBName} />
        <InfoRow label="Score" value={<span className="text-lg font-bold" style={{ color: '#D4AF37' }}>{insight.match.score}</span>} />
        <InfoRow label="Resonans" value={<span className="text-sm font-semibold" style={{ color: insight.match.resonanceLevel === 'DEEP' ? '#9C27B0' : '#D4AF37' }}>{insight.match.resonanceLevel}</span>} />
        <InfoRow label="Status" value={insight.match.status} />
        <InfoRow label="Oppretta" value={new Date(insight.match.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      {/* Innsikt */}
      <DetailSection title="Oppsummering">
        <InfoRow label="Summary" value={insight.summary} monospace />
      </DetailSection>

      <DetailSection title="Styrker">
        <InfoRow label="Styrker" value={insight.strengths} monospace />
      </DetailSection>

      <DetailSection title="Tydeleggjering">
        <InfoRow label="Klarheit" value={insight.clarity} monospace />
      </DetailSection>

      <DetailSection title="Start-spørsmål">
        <InfoRow label="Starter" value={insight.starter} monospace />
      </DetailSection>

      {/* Metadata */}
      <DetailSection title="Metadata">
        <InfoRow label="Model" value={insight.model || '—'} />
        <InfoRow label="Token ut" value={insight.tokensOut.toString()} />
        <InfoRow label="Oppretta" value={new Date(insight.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      {/* Raw */}
      <DetailSection title="Raw JSON">
        <pre
          className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-96"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
        >
          {JSON.stringify(insight, null, 2)}
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