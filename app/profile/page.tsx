/**
 * ToSom — Profil Side (Produktnivå)
 * 
 * Viser din egen profil med dynamiske oppdateringer fra:
 * - Journey-fase
 * - Varme-nivå
 * - Match-score
 * Resonans fjernet per platform-endring.
 * Stabilisering: Radius, padding, animasjon
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProfileSkeleton as ProfileLoadSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import { ProfileSecurityCard } from '@/components/profile/ProfileSecurityCard';

interface ProfileData {
  identityName: string;
  bio: string;
  tags: string[];
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
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile/me');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          identityName: data.identityName || 'Din profil',
          bio: data.bio || '',
          tags: data.tags || [],
          warmScore: data.warmScore ?? 0,
          phaseOrder: data.phaseOrder ?? 1,
          currentDay: data.currentDay ?? 1,
          daysRemaining: data.daysRemaining ?? 30,
          matchScore: data.matchScore ?? 0,
          photoUrl: data.photoUrl || null,
        });
      } else {
        // Fallback til dummy-data om API-et ikke er implementert enno
        setProfile({
          identityName: 'Din profil',
          bio: 'Bygger reisen min...',
          tags: [],
          warmScore: 0,
          phaseOrder: 1,
          currentDay: 1,
          daysRemaining: 30,
          matchScore: 0,
          photoUrl: null,
        });
      }
    } catch {
      // Ingen feil — vis dummy-data som fallback
      setProfile({
        identityName: 'Din profil',
        bio: 'Bygger reisen min...',
        tags: [],
        warmScore: 0,
        phaseOrder: 1,
        currentDay: 1,
        daysRemaining: 30,
        matchScore: 0,
        photoUrl: null,
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-8">
        <ProfileLoadSkeleton />
      </div>
    );
  }

  if (!profile) return null;

  const phaseColors = ['', '#D4AF37', '#4DFF88', '#B48CFF', '#FF82C8', '#FFD700'];
  const phaseNames = ['', 'Introduksjon', 'Trygghet', 'Sårbarhet', 'Fremtid', 'Djupne'];
  const phaseColor = phaseColors[profile.phaseOrder] || '#D4AF37';
  const phaseName = phaseNames[profile.phaseOrder] || 'Introduksjon';

  return (
    <main className="mx-auto max-w-[720px] px-6 py-8">
      {/* Header — Modul 3: Animasjon 500ms → 400ms */}
      <div className="text-center mb-6 animate-fadeIn" style={{ animationDuration: '400ms' }}>
        <div
          className="w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center"
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
        <h1 className="text-xl font-light mb-2" style={{ color: '#FFFFFF' }}>
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

      {/* Varme */}
      <div className="mb-6 p-4 rounded-xl" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 className="text-base font-medium mb-3" style={{ color: '#FFFFFF' }}>Varme</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{
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
        <div className="mb-6 p-4 rounded-xl" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 className="text-base font-medium mb-3" style={{ color: '#FFFFFF' }}>Profilerings-tags</h2>
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

      {/* Profil-sikkerheit — Modul 2: Tone alignment + Modul 3: +2px spacing */}
      <div className="mb-8">
        <ProfileSecurityCard showDetails={true} />
      </div>

      {/* Navigasjon */}
      <div className="flex justify-center gap-4">
        <Link href="/journey" className="px-6 py-3 rounded-lg text-sm font-medium" style={{
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.25)',
          color: '#D4AF37',
        }}>
          Journey Dashboard
        </Link>
        <Link href="/chat" className="px-6 py-3 rounded-lg text-sm font-medium" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)',
        }}>
          Til Chat
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}