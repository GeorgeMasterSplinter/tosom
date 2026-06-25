'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

const mockUsers = [
  { id: 'u1', email: 'ola@tosom.no', phone: '+4790000001', created: '2026-06-20', status: 'active', matches: 2, journeys: 1, superUser: false },
  { id: 'u2', email: 'kari@tosom.no', phone: '+4790000002', created: '2026-06-19', status: 'active', matches: 1, journeys: 1, superUser: false },
  { id: 'u3', email: 'super1@tosom.test', phone: '+4700000001', created: '2026-01-01', status: 'active', matches: 5, journeys: 3, superUser: true },
  { id: 'u4', email: 'erik@tosom.no', phone: '+4790000004', created: '2026-06-18', status: 'flagged', matches: 0, journeys: 0, superUser: false },
  { id: 'u5', email: 'anna@tosom.no', phone: '+4790000005', created: '2026-06-15', status: 'disabled', matches: 3, journeys: 2, superUser: false },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'flagged' | 'disabled'>('all');

  const filtered = mockUsers.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchesFilter = filter === 'all' || u.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Brukarar</h1>
          <p className="text-sm text-white/40 mt-1">{mockUsers.length} totale brukarar</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'flagged', 'disabled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
              style={filter === f ? { border: '1px solid rgba(212,175,55,0.25)' } : { border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {f === 'all' ? 'Alle' : f === 'active' ? 'Aktive' : f === 'flagged' ? 'Flagga' : 'Deaktive'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Søk på e-post eller telefon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#FFFFFF',
          }}
          onFocus={(e) => {
            (e.target as HTMLElement).style.borderColor = 'rgba(212,175,55,0.5)';
            (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)';
          }}
          onBlur={(e) => {
            (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.target as HTMLElement).style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Users table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['E-post', 'Telefon', 'Status', 'Matcher', 'Reiser', 'Super', 'Aksjonar'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-white/40 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-sm text-white/80">
                    <a href={`/admin/users/${user.id}`} className="hover:text-[#D4AF37] transition-colors">{user.email}</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      user.status === 'active' ? 'bg-[rgba(77,255,136,0.1)] text-[#4DFF88]' :
                      user.status === 'flagged' ? 'bg-[rgba(255,212,55,0.1)] text-[#FFD437]' :
                      'bg-[rgba(255,77,77,0.1)] text-[#FF4D4D]'
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{user.matches}</td>
                  <td className="px-4 py-3 text-sm text-white/50">{user.journeys}</td>
                  <td className="px-4 py-3 text-sm text-white/50">{user.superUser ? '⭐ Ja' : 'Nei'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <a href={`/admin/users/${user.id}`} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>Sjå</a>
                      {user.status !== 'disabled' && (
                        <button className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,77,77,0.08)', color: 'rgba(255,77,77,0.7)' }}>Disable</button>
                      )}
                      <button className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,212,55,0.08)', color: 'rgba(255,212,55,0.7)' }}>Flagg</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}