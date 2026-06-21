/**
 * ToSom UI 5.0 - TrustSection (Dark Blue-Gray Edition)
 * 
 * "Kva ToSom ikkje er" seksjon med glass-kort, gull-border
 * blur 18px, gull-border opacity 0.18, større ikon
 * Mørk blågrå bakgrunn, responsive
 * Bokmål
 */

import { FC } from 'react';

interface TrustItem {
  icon: React.ReactNode;
  text: string;
}

interface TrustSectionProps {
  title?: string;
  subtitle?: string;
  notFeatures: TrustItem[];
}

export const TrustSection: FC<TrustSectionProps> = ({
  title = 'Hva ToSom ikke er',
  subtitle = 'Vi har fjernet all støy, press og overfladiskhet',
  notFeatures,
}) => {
  return (
    <section className="py-36 md:py-44 lg:py-52 relative overflow-hidden" style={{
      background: `
        linear-gradient(180deg, #0A0D12 0%, #0E1218 20%, #12161C 45%, #14181E 50%, #14181E 55%, #12161C 75%, #0E1218 80%, #0A0D12 100%)
      `
    }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.076), transparent 70%),
            radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.262) 100%),
            radial-gradient(ellipse 40% 60% at 0% 50%, rgba(80,120,255,0.038), transparent 50%),
            radial-gradient(ellipse 40% 60% at 100% 50%, rgba(80,120,255,0.038), transparent 50%)
          `,
        }}
      />
      <div className="mx-auto max-w-[1000px] px-6 lg:px-8 relative z-10">
        {/* Header — Round 6: +6px spacing, text-shadow på tittel */}
        <div className="text-center mb-26 md:mb-30">
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
            style={{ color: '#D4AF37' }}
          >
            Trygghet
          </span>
          <h2
            className="text-3xl lg:text-[40px] font-semibold mb-4"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 0 10px rgba(255,255,255,0.12)',
            }}
          >
            {title}
          </h2>
          <p
            className="text-base lg:text-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.65',
              letterSpacing: '-0.015em',
              textShadow: '0 0 12px rgba(255,255,255,0.15)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Round 6: gap +8px, glass micro-polish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {notFeatures.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 rounded-2xl transition-all duration-300 cubic-bezier(0.22, 1, 0.36, 1) group hover:scale-[1.02]"
              style={{
                background: `
                  linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%),
                  rgba(255, 255, 255, 0.025)
                `,
                backdropFilter: 'blur(28px)',
                border: '1.5px solid rgba(212, 175, 55, 0.19)',
                boxShadow: 'inset 0 0 24px rgba(0,0,0,0.45), 0 0 25px rgba(255,255,255,0.10), 0 0 12px rgba(80,120,255,0.12)',
              }}
            >
              <div
                className="flex-shrink-0 w-[56px] h-[56px] md:w-[60px] md:h-[60px] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(255, 77, 77, 0.12)',
                  border: '1.5px solid rgba(255, 77, 77, 0.18)',
                  color: '#FF4D4D',
                  boxShadow: 'inset 0 0 12px rgba(255,77,77,0.08)',
                }}
              >
                {item.icon}
              </div>
              <span
                className="text-sm font-medium transition-colors duration-300 group-hover:text-white/65"
                style={{ color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '-0.02em' }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Round 6: Positive cards gap +6px */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {[
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1L12.5 6.5L18 7.5L14 11.5L15 17L10 14.5L5 17L6 11.5L2 7.5L7.5 6.5L10 1Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              text: 'Ingen offentlige profiler',
              desc: 'Profilen din er privat og aldri synlig for andre',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
                  <circle cx="8" cy="10" r="5" stroke="#D4AF37" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="5" stroke="#D4AF37" strokeWidth="1.5" />
                </svg>
              ),
              text: 'Én match, ikke mange',
              desc: 'Den beste kompatibiliteten, ikke tilfeldige valg',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3V10L14 14" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="7" stroke="#D4AF37" strokeWidth="1.5" />
                </svg>
              ),
              text: 'Full personvern og databeskyttelse',
              desc: 'Du kontrollerer hva du deler og når du deler det',
            },
          ].map((item) => (
            <div
              key={item.text}
              className="text-center px-7 py-7 rounded-2xl transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) group hover:scale-[1.03]"
              style={{
                background: `
                  linear-gradient(180deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%),
                  rgba(212, 175, 55, 0.06)
                `,
                backdropFilter: 'blur(26px)',
                border: '2px solid rgba(212, 175, 55, 0.26)',
                boxShadow: '0 0 60px rgba(80,120,255,0.10), inset 0 0 24px rgba(255,255,255,0.06), 0 0 25px rgba(255,255,255,0.12), 0 0 12px rgba(80,120,255,0.15)',
              }}
            >
              <div
                className="w-[64px] h-[64px] rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
                style={{
                  background: 'rgba(212, 175, 55, 0.14)',
                  border: '1.5px solid rgba(212, 175, 55, 0.28)',
                  color: '#D4AF37',
                  boxShadow: 'inset 0 0 16px rgba(212,175,55,0.10), 0 0 35px rgba(212,175,55,0.08)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.14), transparent)',
                    opacity: 0.5,
                  }}
                />
                {item.icon}
              </div>
              <p
                className="text-sm font-medium mb-1.5"
                style={{ color: '#FFFFFF', letterSpacing: '-0.02em', textShadow: '0 0 10px rgba(255,255,255,0.12)' }}
              >
                {item.text}
              </p>
              <p
                className="text-xs"
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  lineHeight: '1.5',
                  letterSpacing: '-0.015em',
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;