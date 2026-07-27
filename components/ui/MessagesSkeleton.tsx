// components/ui/MessagesSkeleton.tsx — Chat-bobler som pulserar (gold-pulse variant)
'use client';

interface MessagesSkeletonProps {
  count?: number;
  className?: string;
}

export function MessagesSkeleton({ count = 5, className = '' }: MessagesSkeletonProps) {
  return (
    <div className={`ts-messages-skeleton ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      {Array.from({ length: count }).map((_, i) => {
        const isRight = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: isRight ? 'flex-end' : 'flex-start',
              animation: `skeletonPulse 2s ${i * 0.15}s infinite ease-in-out`,
            }}
          >
            <div style={{
              maxWidth: '75%',
              borderRadius: isRight ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: i % 3 === 0 
                ? 'rgba(212, 175, 55, 0.06)' 
                : 'rgba(255, 255, 255, 0.04)',
              padding: '12px 16px',
              animation: `skeletonGlow ${2 + i * 0.2}s infinite alternate ease-in-out`,
            }}>
              {/* Tekst-linjer */}
              {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: j === 0 ? '16px' : '12px',
                    width: j === 0 
                      ? `${60 + Math.random() * 30}%` 
                      : `${40 + Math.random() * 40}%`,
                    borderRadius: '4px',
                    background: `linear-gradient(90deg, rgba(255,255,255,${i % 3 === 0 ? 0.06 : 0.04}) 25%, rgba(255,255,255,${i % 3 === 0 ? 0.1 : 0.06}) 50%, rgba(255,255,255,${i % 3 === 0 ? 0.06 : 0.04}) 75%)`,
                    backgroundSize: '200% 100%',
                    animation: `shimmer 1.5s ${j * 0.1}s infinite linear`,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Stilk med animasjonar
export const MessagesSkeletonStyles = () => (
  <style>{`
    @keyframes skeletonPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes skeletonGlow {
      0% { box-shadow: 0 0 8px rgba(212,175,55,0.03); }
      50% { box-shadow: 0 0 16px rgba(212,175,55,0.08); }
      100% { box-shadow: 0 0 8px rgba(212,175,55,0.03); }
    }
    @keyframes shimmer {
      0% { background-position: '-200% 0'; }
      100% { background-position: '200% 0'; }
    }
  `}</style>
);

export default MessagesSkeleton;