// components/journey/PremiumJourneyDayView.tsx — Dagvis visning med tema/refleksjon/oppgåve
'use client';

interface DayContentProps {
  day: number;
  phase: string;
  theme: string;
  title: string;
  reflection: string;
  task?: string;
}

export function PremiumJourneyDayView({ content }: { content: DayContentProps }) {
  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      animation: 'fadeIn 500ms ease-out',
    }}>
      {/* Dag-hovud */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          fontSize: '60px',
          fontWeight: '600',
          background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
        }}>
          Dag {content.day}
        </div>
        <div style={{ fontSize: '20px', color: '#D4AF37', fontWeight: '500', marginTop: '8px' }}>
          {content.title}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
          {content.theme} · {content.phase}
        </div>
      </div>

      {/* Refleksjon — glass-panel med gull-left-border */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        borderLeft: '4px solid #D4AF37',
        borderRadius: '0 20px 20px 20px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '500', marginBottom: '12px' }}>
          Refleksjon for dagen
        </div>
        <div style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', fontStyle: 'italic' }}>
          {content.reflection}
        </div>
      </div>

      {/* Oppgåve — gull-bg */}
      {content.task && (
        <div style={{
          background: 'rgba(212, 175, 55, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '16px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '500', marginBottom: '8px' }}>
            Oppgåve for dagen
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {content.task}
          </div>
        </div>
      )}
    </div>
  );
}