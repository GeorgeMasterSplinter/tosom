/**
 * ToSom UI 5.0 — Logo
 * 
 * To sirkler som møtest i roleg overlapping
 * Symboliserer to personar — nordisk, moderne, premium
 */

import { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizes = {
  sm: { circle: 28, text: 'text-lg', logoText: 'text-lg' },
  md: { circle: 36, text: 'text-xl', logoText: 'text-xl' },
  lg: { circle: 48, text: 'text-2xl', logoText: 'text-2xl' },
} as const;

export const Logo: FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  href,
}) => {
  const s = sizes[size];

  const logo = (
    <div className={`inline-flex items-center gap-${size === 'sm' ? '2' : '3'} ${className}`}>
      {/* Logo mark — two overlapping circles */}
      <svg
        width={s.circle}
        height={s.circle}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="ToSom logo"
      >
        {/* Left circle — slightly lighter gold */}
        <circle
          cx="15"
          cy="20"
          r="12"
          fill="rgba(212, 175, 55, 0.35)"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        {/* Right circle — full gold */}
        <circle
          cx="25"
          cy="20"
          r="12"
          fill="rgba(212, 175, 55, 0.2)"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        {/* Overlap glow */}
        <circle
          cx="20"
          cy="20"
          r="6"
          fill="rgba(212, 175, 55, 0.15)"
        />
      </svg>

      {/* Logo text */}
      {showText && (
        <span className={`font-semibold text-[#D4AF37] tracking-tight ${s.logoText}`}>
          ToSom
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="inline-flex items-center"
        aria-label="ToSom heimside"
      >
        {logo}
      </a>
    );
  }

  return logo;
};

export default Logo;