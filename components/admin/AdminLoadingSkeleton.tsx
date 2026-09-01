/**
 * Tosom Admin — Loading Skeleton (gjenbrukbar)
 * 
 * Viser et ryddig skeleton når data lastar fra API.
 */

'use client';

interface AdminSkeletonProps {
  title?: string;
  statsCount?: number;      // antal stat-kort å vise
  tableRows?: number;       // antal radar i tabell
  tableColumns?: number;    // antal kolonnar i tabell
}

export function AdminSkeleton({ 
  title = 'Lastar innhold...', 
  statsCount = 0, 
  tableRows = 5, 
  tableColumns = 6 
}: AdminSkeletonProps) {
  return (
    <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
      <div className="mx-auto px-4 py-8 max-w-7xl space-y-6">
        
        {/* Tittel-skeleton */}
        <div className="space-y-3">
          <div 
            className="h-8 w-48 rounded-lg animate-pulse"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div 
            className="h-4 w-72 rounded animate-pulse"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>

        {/* Stats-kort skeleton */}
        {statsCount > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: statsCount }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-5 space-y-3 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div 
                  className="h-3 w-16 rounded animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                <div 
                  className="h-8 w-20 rounded animate-pulse"
                  style={{ background: 'rgba(212,175,55,0.15)' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tabell skeleton */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Table header skeleton */}
          <div 
            className="flex items-center gap-4 px-6 py-3"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {Array.from({ length: tableColumns }).map((_, i) => (
              <div 
                key={i}
                className="h-3 rounded animate-pulse flex-1"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>

          {/* Table rows skeleton */}
          {Array.from({ length: tableRows }).map((_, row) => (
            <div 
              key={row}
              className="flex items-center gap-4 px-6 py-4 border-t border-white/5"
            >
              {Array.from({ length: tableColumns }).map((_, col) => (
                <div 
                  key={col}
                  className="h-4 rounded animate-pulse flex-1"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)',
                    animationDelay: `${(row * tableColumns + col) * 50}ms`
                  }}
                />
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/** Enkel loading-spinner for små komponentar */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  
  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle 
          cx="12" cy="12" r="10" 
          stroke="rgba(212,175,55,0.2)" 
          strokeWidth="3"
        />
        <path 
          d="M12 2a10 10 0 0 1 10 10" 
          stroke="#D4AF37" 
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}