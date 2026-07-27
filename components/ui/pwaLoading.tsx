/**
 * ToSom UI 3.0 — PWA Loading Screen
 *
 * First-content-for-PWA screen with brand animation.
 * Shows while service worker and app initialize.
 *
 * Usage:
 *   <PWALoadingScreen />
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';

const PWALoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in
    const fadeTimer = setTimeout(() => setOpacity(1), 50);

    // Simulate loading phases
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(p + 2, 100);
      });
    }, 50);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0A0F1F',
      }}
    >
      {/* Logo mark */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(212,175,55,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 1,
          borderColor: 'rgba(212,175,55,0.15)',
        }} />
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(212,175,55,0.1)',
          borderWidth: 1,
          borderColor: 'rgba(212,175,55,0.3)',
        }} />
      </div>

      {/* Brand */}
      <span style={{
        fontSize: 32,
        fontWeight: 600,
        color: '#D4AF37',
        letterSpacing: -0.5,
        marginBottom: 8,
      }}>ToSom</span>

      {/* Tagline */}
      <span style={{
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
        marginBottom: 40,
      }}>To mennesker. Én reise.</span>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#D4AF37',
          borderRadius: 2,
          transition: 'width 50ms ease-in-out',
        }} />
      </div>

      {/* Status */}
      <span style={{
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 0.3,
      }}>
        {progress < 30 ? 'Laster oppsett...' :
         progress < 60 ? 'Forbereder reisen...' :
         progress < 90 ? 'Nesten klar...' :
         'Velkommen tilbake!'}
      </span>
    </div>
  );
};

PWALoadingScreen.displayName = 'PWALoadingScreen';
export default PWALoadingScreen;