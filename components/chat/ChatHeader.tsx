'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toResonanceLevel, resonanceLabel } from '@/lib/matching/resonanceLevel';
import { csrfFetch } from '@/lib/api/csrfClient';

interface ChatHeaderProps {
  partnerName: string;
  partnerAge?: number;
  distance?: string;
  currentDay: number;
  resonanceScore?: number;
  onBliKjentClick?: () => void;
  // C2: Safety actions
  partnerId?: string;
  matchId?: string;
}

/* ====== Icons ====== */
function IconDots() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ====== Confirm Modal (C2 — påkrevd bekreftelsestekst) ====== */
function ConfirmModal({
  title, message, warningText, confirmText, danger, onCancel, onConfirm, loading,
}: {
  title: string; message: string; warningText: string; confirmText: string;
  danger?: boolean; onCancel: () => void; onConfirm: () => void; loading?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-8 text-center relative" style={{ background: 'rgba(11, 21, 32, 0.97)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <button onClick={onCancel} className="absolute top-4 right-4"><IconX /></button>
        <h3 className="mb-3 text-xl font-bold" style={{ color: danger ? '#EF4444' : '#D4AF37' }}>{title}</h3>
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{message}</p>
        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(212,175,55,0.8)', marginBottom: '24px', fontStyle: 'italic' }}>{warningText}</p>
        <button onClick={onConfirm} disabled={loading} className="w-full py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]" style={{ background: danger ? '#EF4444' : 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520' }}>
          {loading ? 'Behandler...' : confirmText}
        </button>
        <button onClick={onCancel} className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80" style={{ color: 'rgba(255,255,255,0.4)' }}>Avbryt</button>
      </div>
    </div>
  );
}

/* ====== Report Modal (C2 — kobler til C1 API) ====== */
function ReportModal({ partnerId, matchId, onCancel, onSubmit }: { partnerId: string; matchId?: string; onCancel: () => void; onSubmit: () => void }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const categories = [
    { value: 'HARASSMENT', label: 'Uønsket atferd' },
    { value: 'INAPPROPRIATE', label: 'Upassende innhold' },
    { value: 'SPAM', label: 'Spam' },
    { value: 'FAKE_PROFILE', label: 'Falsk profil' },
    { value: 'OTHER', label: 'Annet' },
  ];

  const handleSubmit = async () => {
    if (!category) return;
    setSending(true);
    try {
      const res = await csrfFetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportedId: partnerId, matchId, category, description }),
      });
      if (res.ok) {
        onSubmit();
      }
    } catch {
      console.error('Feil ved rapportering');
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-8 relative" style={{ background: 'rgba(11,21,32,0.97)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <button onClick={onCancel} className="absolute top-4 right-4"><IconX /></button>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#D4AF37' }}>Rapporter brukeren</h3>
        <div className="space-y-2 mb-4">
          {categories.map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)} className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all" style={{ background: category === c.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${category === c.value ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`, color: 'rgba(255,255,255,0.7)' }}>
              {c.label}
            </button>
          ))}
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beskriv hva som skjedde (valgfritt)..." rows={3} className="w-full px-4 py-3 rounded-xl text-sm mb-4 bg-transparent border resize-none focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }} />
        <button onClick={handleSubmit} disabled={!category || sending} className="w-full py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]" style={{ background: category ? 'linear-gradient(135deg, #D4AF37, #E8C766)' : 'rgba(255,255,255,0.1)', color: '#0B1520' }}>
          {sending ? 'Sender...' : 'Send rapport'}
        </button>
      </div>
    </div>
  );
}

/* ====== Main Component ====== */
export default function ChatHeader({
  partnerName, partnerAge, distance, currentDay, resonanceScore = 0, onBliKjentClick,
  partnerId, matchId,
}: ChatHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lukk meny ved klikk utenfor
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const resonanceColor = resonanceScore >= 80 ? '#4DFF88' : resonanceScore >= 60 ? '#D4AF37' : '#FF82C8';

  // C2: Action handler
  const handleAction = async () => {
    if (!confirmAction) return;
    setLoading(true);

    try {
      if (confirmAction === 'end') {
        await csrfFetch('/api/journey/exit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'early_exit' }) });
      } else if (confirmAction === 'block') {
        await csrfFetch('/api/journey/exit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'blocked' }) });
      }
      router.push('/dashboard?ended=safety');
    } catch {
      console.error('Feil ved handling');
    }

    setConfirmAction(null);
    setLoading(false);
  };

  return (
    <>
      <header className="flex items-start justify-between px-6 sm:px-8 py-4 border-b relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(10,26,58,0.5) 0%, rgba(11,21,32,0.7) 100%)', backdropFilter: 'blur(20px)', borderColor: 'rgba(212,175,55,0.12)', boxShadow: '0 1px 0 rgba(212,175,55,0.06), 0 -2px 16px rgba(0,0,0,0.15)' }}>
        {/* Shimmer */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)', animation: 'headerShimmer 4s infinite ease-in-out' }} />

        {/* Venstre: Partner-info */}
        <div className="flex-1 min-w-0 pr-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#FFF' }}>{partnerName}</h2>
            {partnerAge && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>· {partnerAge} år</span>}
            {distance && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>· {distance}</span>}
          </div>
          {onBliKjentClick && (
            <button onClick={onBliKjentClick} className="flex flex-col items-center justify-center gap-1.5 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
              <span className="text-3xl leading-none">💎</span>
              <span className="text-xs font-semibold tracking-wide">Bli kjent</span>
            </button>
          )}
        </div>

        {/* Høyre: Dag + Resonans + C2 Meny */}
        <div className="flex flex-col items-end gap-1.5 relative" ref={menuRef}>
          {/* Dag badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600 }}>Dag {currentDay}/30</span>
          </div>

          {/* Resonans — B1.5: nivå som ord, aldri tall (I-12) */}
          {resonanceScore > 0 && (
            <div className="inline-flex items-center px-3 py-1 rounded-full" style={{ background: `${resonanceColor}12`, border: `1px solid ${resonanceColor}40` }}>
              <span style={{ color: resonanceColor, fontSize: '12px', fontWeight: 600 }}>
                {resonanceLabel(toResonanceLevel(resonanceScore))}
              </span>
            </div>
          )}

          {/* C2: Safety meny (diskret, ikke fremtredende) */}
          {partnerId && (
            <div className="relative mt-1">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full transition-all hover:bg-white/5" aria-label="Meny">
                <IconDots />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 rounded-2xl py-2 z-50" style={{ background: 'rgba(15,25,40,0.97)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <button onClick={() => { setShowReport(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    🚩 Rapporter brukeren
                  </button>
                  <button onClick={() => { setConfirmAction('end'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    ✋ Avslutt reisen
                  </button>
                  <button onClick={() => { setConfirmAction('block'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5" style={{ color: '#EF4444' }}>
                    🚫 Blokker og avslutt
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <style>{`@keyframes headerShimmer{0%{opacity:0;transform:translateX(-100%)}50%{opacity:1}100%{opacity:0;transform:translateX(100%)}}`}</style>

      {/* C2: Modaler */}
      {showReport && partnerId && (
        <ReportModal partnerId={partnerId} matchId={matchId} onCancel={() => setShowReport(false)} onSubmit={() => { setShowReport(false); }} />
      )}

      {confirmAction === 'end' && (
        <ConfirmModal title="Avslutt reisen?" message="Reisen avsluttes. Samtalen slettes for dere begge." warningText="Dette sletter samtalen for dere begge. Det kan ikke angres." confirmText="Ja, avslutt reisen" danger onCancel={() => setConfirmAction(null)} onConfirm={handleAction} loading={loading} />
      )}

      {confirmAction === 'block' && (
        <ConfirmModal title="Blokker og avslutt?" message="Reisen avsluttes. Brukeren blokkeres permanent." warningText="Dette sletter samtalen for dere begge. Det kan ikke angres." confirmText="Ja, blokker og avslutt" danger onCancel={() => setConfirmAction(null)} onConfirm={handleAction} loading={loading} />
      )}
    </>
  );
}