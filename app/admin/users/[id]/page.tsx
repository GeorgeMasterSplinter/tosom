/**
 * ToSom — Admin Brukar Detalj
 * 
 * Server Component — viser all informasjon om éin brukar:
 * - Profildata
 * - Deep Profile JSON
 * - Journey-status
 * - Matcher
 * - Samtaler
 */

import { getUserById } from '@/lib/admin/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

/* ====== Hovudkomponent ====== */

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/users"
          className="text-sm transition-colors duration-200 w-fit"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ← Tilbake til brukarar
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
          Brukardetalj
        </h1>
      </div>

      {/* Basis-info */}
      <DetailSection title="Basisinformasjon">
        <InfoRow label="ID" value={user.id} monospace />
        <InfoRow label="E-post" value={user.email} />
        <InfoRow label="Rolle" value={user.role} />
        <InfoRow label="Verifisert" value={user.verified ? 'Ja ✓' : 'Nei —'} />
        <InfoRow label="Banna" value={user.banned ? 'Ja' : 'Nei'} />
        <InfoRow label="Onboarding" value={user.onboardingComplete ? 'Fullført ✓' : 'Ikkje fullført'} />
        <InfoRow label="Deep Profile" value={user.deepProfileComplete ? 'Fullført ✓' : 'Ikkje fullført'} />
        <InfoRow label="Oppretta" value={new Date(user.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      {/* Profil */}
      {user.profile && (
        <DetailSection title="Profil">
          <InfoRow label="Namn" value={user.profile.identityName || 'Ukjent'} />
          <InfoRow label="Alder" value={user.profile.age?.toString() || 'Ikkje oppgitt'} />
          <InfoRow label="Relasjonsstil" value={user.profile.relationshipStyle || 'Ikkje oppgitt'} />
          <InfoRow label="Modenheit" value={user.profile.maturityLevel?.toString() || 'Ikkje oppgitt'} />
          <InfoRow label="Deep Profile Step" value={user.profile.deepProfileStep} />
          {user.profile.lifestyle && (
            <InfoRow label="Livsstil" value={JSON.stringify(user.profile.lifestyle, null, 2)} monospace />
          )}
          {user.profile.personality && (
            <InfoRow label="Personlegheit" value={JSON.stringify(user.profile.personality, null, 2)} monospace />
          )}
          {user.profile.communication && (
            <InfoRow label="Kommunikasjon" value={JSON.stringify(user.profile.communication, null, 2)} monospace />
          )}
          {user.profile.intimacy && (
            <InfoRow label="Intimitet" value={JSON.stringify(user.profile.intimacy, null, 2)} monospace />
          )}
          {user.profile.futureVision && (
            <InfoRow label="Framtid" value={JSON.stringify(user.profile.futureVision, null, 2)} monospace />
          )}
          {user.profile.boundaries && (
            <InfoRow label="Grenser" value={JSON.stringify(user.profile.boundaries, null, 2)} monospace />
          )}
          {user.profile.emotionalNeeds && (
            <InfoRow label="Emosjonelle behov" value={JSON.stringify(user.profile.emotionalNeeds, null, 2)} monospace />
          )}
        </DetailSection>
      )}

      {/* Journey */}
       {user.journey && (
         <DetailSection title="Reise">
           <InfoRow label="Fase" value={user.journey.phase ?? 'Ikkje starta'} />
           <InfoRow label="Dag" value={user.journey.day.toString()} />
           <InfoRow label="Fullførte dagar" value={user.journey.completedDays.toString()} />
         </DetailSection>
       )}

      {/* JSON-utsyn */}
      <DetailSection title="Raw JSON">
        <pre
          className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-80"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            verified: user.verified,
            banned: user.banned,
            profile: user.profile,
            journey: user.journey,
          }, null, 2)}
        </pre>
      </DetailSection>
    </div>
  );
}

/* ====== Underkomponentar ====== */

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2 className="text-base font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.7)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, monospace = false }: { label: string; value: string; monospace?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
      <span
        className="text-sm"
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontFamily: monospace ? 'monospace' : 'inherit',
          whiteSpace: monospace ? 'pre-wrap' : 'normal',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </span>
    </div>
  );
}