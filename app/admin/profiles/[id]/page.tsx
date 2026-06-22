/**
 * ToSom — Admin Profil Detalj
 * 
 * Server Component — viser full profil med relasjonar.
 */

import { getProfileById } from '@/lib/admin/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) notFound();

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/profiles"
          className="text-sm transition-colors duration-200 w-fit"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ← Tilbake til profiler
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
          Profildetalj
        </h1>
      </div>

      <DetailSection title="Profilinformasjon">
        <InfoRow label="ID" value={profile.id} monospace />
        <InfoRow label="Bruker-ID" value={profile.userId} monospace />
        <InfoRow label="Namn" value={profile.identityName || 'Ukjent'} />
        <InfoRow label="Alder" value={profile.age?.toString() || 'Ikkje oppgitt'} />
        <InfoRow label="Relasjonsstil" value={profile.relationshipStyle || 'Ikkje oppgitt'} />
        <InfoRow label="Deep Profile" value={profile.deepProfileComplete ? 'Fullført ✓' : 'Ikkje fullført'} />
        <InfoRow label="Steg" value={profile.deepProfileStep} />
        <InfoRow label="Oppretta" value={new Date(profile.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      <DetailSection title="Brukar">
        <InfoRow label="Bruker-ID" value={profile.userId} monospace />
        <InfoRow label="E-post" value={profile.userEmail ?? 'Ikkje funnen'} />
      </DetailSection>

      <DetailSection title="Raw JSON">
        <pre
          className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-80"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {JSON.stringify(profile, null, 2)}
        </pre>
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
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