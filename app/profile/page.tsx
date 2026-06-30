/**
 * ToSom — Profil Side (Produktnivå)
 * 
 * Visar din eigen profil med dynamiske oppdateringar frå:
 * - Journey-fase
 * - Resonans-score
 * - Varme-nivå
 * - Match-score
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProfileData {
  identityName: string;
  bio: string;
  tags: string[];
  resonanceScore: number;
  warmScore: number;
  phaseOrder: number;
  currentDay: number;
  daysRemaining: number;
  matchScore: number;
  photoUrl: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Hent frå /api/profile/me
    // For no: dummy-data
    setProfile({
      identityName: 'Din profil',
      bio: 'Bygger reisa mi...',
      tags: [],
      resonanceScore: 0,
      warmScore: 0,
      phaseOrder: 1,
      currentDay: 1,
      daysRemaining: 30,
      matchScore: 0,
      photoUrl: null,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
            border: '2px solid rgba(255,255,255,0.2)',
            borderTopColor: '#D4AF37',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Lastar profil...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const phaseColors = ['', '#D4AF37', '#4DFF88', '#B48CFF', '#FF82C8', '#FFD700'];
  const phaseNames = ['', 'Introduksjon', 'Trygghet', 'Sårbarhet', 'Fremtid', 'Djupne'];
  const phaseColor = phaseColors[profile.phaseOrder] || '#D4AF37';
  const phaseName = phaseNames[profile.phaseOrder] || 'Introduksjon';

  return (
    <main className="mx-auto max-w-[720px] px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div
          className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: profile.photoUrl ? `url(${profile.photoUrl}) center/cover` : 'rgba(212,175,55,0.1)',
            border: `2px solid ${phaseColor}`,
            boxShadow: `0 0 24px ${phaseColor}30`,
          }}
        >
          {!profile.photoUrl && <span style={{ color: phaseColor, fontSize: '32px', fontWeight: 500 }}>
            {profile.identityName.charAt(0).toUpperCase()}
          </span>}
        </div>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
          {profile.identityName}
        </h1>
        <span className="px-3 py-1 rounded-full text-sm" style={{
          background: `${phaseColor}15`,
          border: `1px solid ${phaseColor}30`,
          color: phaseColor,
        }}>
          {phaseName} · Dag {profile.currentDay}/30
        </span>
      </div>

      {/* Resonans */}
      <div className="mb-8 p-6 rounded-2xl" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 className="text-lg font-medium mb-3" style={{ color: '#FFFFFF' }}>Resonans</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
            background: profile.resonanceScore >= 60 ? 'rgba(77,255,136,0.1)' : 'rgba(212,175,55,0.1)',
            border: `1px solid ${profile.resonanceScore >= 60 ? 'rgba(77,255,136,0.2)' : 'rgba(212,175,55,0.2)'}`,
          }}>
            <span style={{ color: profile.resonanceScore >= 60 ? '#4DFF88' : '#D4AF37', fontSize: '20px', fontWeight: 600 }}>
              {profile.resonanceScore}%
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {profile.resonanceScore >= 80 ? 'Djuk resonans' : profile.resonanceScore >= 60 ? 'Sterk resonans' : profile.resonanceScore >= 40 ? 'Moder resonans' : 'Utviklar seg'}
          </p>
        </div>
      </div>

      {/* Varme */}
      <div className="mb-8 p-6 rounded-2xl" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 className="text-lg font-medium mb-3" style={{ color: '#FFFFFF' }}>Varme</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
            background: 'rgba(255,184,108,0.1)',
            border: '1px solid rgba(255,184,108,0.2)',
          }}>
            <span style={{ color: '#FFB86C', fontSize: '20px', fontWeight: 600 }}>
              {profile.warmScore}%
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {profile.warmScore >= 80 ? 'Ekko' : profile.warmScore >= 60 ? 'Glødande' : profile.warmScore >= 40 ? 'Varm' : 'Utviklar seg'}
          </p>
        </div>
      </div>

      {/* Tags */}
      {profile.tags.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 className="text-lg font-medium mb-3" style={{ color: '#FFFFFF' }}>Profilerings-tags</h2>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-sm" style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#D4AF37',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigasjon */}
      <div className="flex justify-center gap-4">
        <Link href="/journey" className="px-6 py-3 rounded-xl text-sm font-medium" style={{
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.25)',
          color: '#D4AF37',
        }}>
          Journey Dashboard
        </Link>
        <Link href="/chat" className="px-6 py-3 rounded-xl text-sm font-medium" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)',
        }}>
          Til Chat
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}