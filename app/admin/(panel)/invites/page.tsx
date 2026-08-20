'use client';

/**
 * Tosom — Admin: Invitasjonsport (BETA-ACCESS §3.3)
 * Legg til e-poster, se hvem som har tatt i bruk invitasjonen.
 */

import { useState, useEffect, useCallback } from 'react';

interface Invite {
  id: string;
  email: string;
  invitedAt: string;
  usedAt: string | null;
  note: string | null;
}

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newEmails, setNewEmails] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/beta/invites');
      if (res.ok) {
        const data = await res.json();
        setInvites(data.invites ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addEmails = async () => {
    const emails = newEmails
      .split(/[,\n\s]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (emails.length === 0) return;

    setMsg('');
    const res = await fetch('/api/beta/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails, note: note || null }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`${data.created} nye, ${data.existing} eksisterte allerede.`);
      setNewEmails('');
      setNote('');
      load();
    } else {
      setMsg(data.error ?? 'Feil');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-light text-[#D4AF37]">Invitasjonsport</h1>
      <p className="text-sm text-white/40">
        Kun inviterte e-poster får magic link sendt. Adressen er nøkkelen.
      </p>

      {/* Legg til */}
      <div className="space-y-3 rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <label className="block text-sm text-white/60">Nye e-poster (kommaseparert eller én per linje)</label>
        <textarea
          value={newEmails}
          onChange={(e) => setNewEmails(e.target.value)}
          rows={3}
          placeholder="george@tosom.no, anna@eksempel.no"
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B1520] border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notat (valgfritt)"
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B1520] border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]/50"
        />
        <button
          onClick={addEmails}
          className="rounded-lg px-4 py-2 text-sm font-medium text-[#0B1520] transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)' }}
        >
          Legg til
        </button>
        {msg && <p className="text-sm text-white/60">{msg}</p>}
      </div>

      {/* Liste */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {loading ? (
          <p className="p-4 text-sm text-white/40">Laster…</p>
        ) : invites.length === 0 ? (
          <p className="p-4 text-sm text-white/40">Ingen invitasjoner ennå.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/50 border-b border-white/10">
                <th className="px-4 py-2">E-post</th>
                <th className="px-4 py-2">Invitert</th>
                <th className="px-4 py-2">Brukt</th>
                <th className="px-4 py-2">Notat</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 text-white/70">
                  <td className="px-4 py-2">{inv.email}</td>
                  <td className="px-4 py-2">{new Date(inv.invitedAt).toLocaleDateString('no-NO')}</td>
                  <td className="px-4 py-2">
                    {inv.usedAt ? (
                      <span className="text-green-400">✓ {new Date(inv.usedAt).toLocaleDateString('no-NO')}</span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-white/40">{inv.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
