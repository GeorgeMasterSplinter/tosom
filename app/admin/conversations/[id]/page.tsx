/**
 * ToSom — Admin Samtale Detalj
 * 
 * Server Component — viser full samtale med chat-lignande UI (readonly).
 */

import { getConversationById } from '@/lib/admin/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conv = await getConversationById(id);

  if (!conv) notFound();

  const typeLabel = (t: string) => {
    const map: Record<string, string> = { user: 'Brukar', system: 'System', continue_choice: 'Valg', image: 'Bilete' };
    return map[t] || t;
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link href="/admin/conversations" className="text-sm transition-colors duration-200 w-fit" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Tilbake til samtalar
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>Samtaledetalj</h1>
      </div>

      {/* Samandrag */}
      <DetailSection title="Samtaleinfo">
        <InfoRow label="ID" value={conv.id} monospace />
        <InfoRow label="Brukar A" value={conv.userAName} />
        <InfoRow label="Brukar B" value={conv.userBName} />
        <InfoRow label="Meldingar" value={conv.messageCount.toString()} />
        <InfoRow label="Siste melding" value={conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' }) : '—'} />
        <InfoRow label="Oppretta" value={new Date(conv.createdAt).toLocaleString('nb-NO', { dateStyle: 'full', timeStyle: 'medium' })} />
      </DetailSection>

      {/* Meldingar — chat-stil */}
      <DetailSection title={`Meldingar (${conv.messageCount})`}>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {conv.messages.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen meldingar enno.</p>
          ) : (
            conv.messages.map((msg, i) => {
              const isSystem = msg.type === 'system';
              const isContinue = msg.type === 'continue_choice';
              return (
                <div
                  key={msg.id}
                  className="animate-[fadeIn_0.3s_ease-out]"
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <div className="flex flex-col gap-1" style={{ alignItems: isSystem ? 'flex-start' : 'flex-end' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: isSystem ? '#9C27B0' : 'rgba(212,175,55,0.6)' }}>
                        {isSystem ? 'System' : msg.senderName}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(msg.createdAt).toLocaleString('nb-NO', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </span>
                      {msg.type !== 'user' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(156,39,176,0.1)', color: '#9C27B0' }}>{typeLabel(msg.type)}</span>
                      )}
                    </div>
                    <div
                      className="max-w-[80%] p-3 rounded-xl text-sm leading-relaxed"
                      style={{
                        background: isSystem
                          ? 'rgba(156,39,176,0.08)'
                          : isContinue
                          ? 'rgba(212,175,55,0.08)'
                          : 'rgba(255,255,255,0.05)',
                        border: isSystem
                          ? '1px solid rgba(156,39,176,0.15)'
                          : isContinue
                          ? '1px solid rgba(212,175,55,0.15)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: isSystem
                          ? '18px 18px 18px 4px'
                          : '18px 18px 4px 18px',
                        color: isSystem ? 'rgba(156,39,176,0.8)' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DetailSection>

      {/* Raw */}
      <DetailSection title="Raw JSON">
        <pre
          className="p-4 rounded-xl overflow-auto text-xs leading-relaxed max-h-80"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
        >
          {JSON.stringify(conv, null, 2)}
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