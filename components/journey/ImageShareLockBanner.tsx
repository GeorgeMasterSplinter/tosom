// components/journey/ImageShareLockBanner.tsx — Visar "Du kan dele bilder om X dagar" countdown
'use client';

import { useState, useEffect } from 'react';

interface ImageShareLockBannerProps {
  imageShareAllowedAt: Date | null;
}

export function ImageShareLockBanner({ imageShareAllowedAt }: ImageShareLockBannerProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!imageShareAllowedAt) return;
    
    const now = Date.now();
    const allowed = new Date(imageShareAllowedAt).getTime();
    
    // Dersom låsen er løyst, vis ikkje banneret (oppdaterast med setStates)
    if (now >= allowed) {
      setDaysLeft(0);
      return;
    }
    
    const diff = allowed - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
    
    // Oppdater kvar time for accurate countdown
    const interval = setInterval(() => {
      const remaining = Math.ceil((allowed - Date.now()) / (1000 * 60 * 60 * 24));
      if (remaining <= 0 || remaining !== days) {
        setDaysLeft(remaining > 0 ? remaining : 0);
      }
    }, 3600000); // kvar time
    
    return () => clearInterval(interval);
  }, [imageShareAllowedAt]);

  // Dersom ingen countdown eller låsen er løyst, vis ingenting
  if (daysLeft === null || daysLeft <= 0) return null;

  return (
    <div style={{
      background: 'rgba(212, 175, 55, 0.06)',
      border: '1px solid rgba(212, 175, 55, 0.15)',
      borderRadius: '16px',
      padding: '16px 24px',
      textAlign: 'center',
      margin: '16px auto',
      maxWidth: '500px',
      animation: 'fadeIn 500ms ease-out',
    }}>
      <div style={{ fontSize: '16px', color: '#D4AF37', fontWeight: '500' }}>
        Du kan dele bilder om {daysLeft} dag{daysLeft !== 1 ? 'ar' : ''}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
        La ord og tanker vere veien mellom dere — i alle fall for no.
      </div>
    </div>
  );
}

// Eksporter også som ImageLockBanner (kortare namn)
export const ImageLockBanner = ImageShareLockBanner;