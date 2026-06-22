/**
 * ToSom UI 5.0 — Logo (ren tekst)
 *
 * Rein tekstlogo — ingen ikon eller symbol.
 * Farge: varm beige (#F5E6C8)
 * Størrelse: text-[22px] md:text-[24px]
 * Ikke skalérande på mobil.
 */

import { FC } from 'react';

interface LogoProps {
  showText?: boolean;
  className?: string;
  href?: string;
}

export const Logo: FC<LogoProps> = ({
  showText = true,
  className = '',
  href,
}) => {
  const logo = (
    <span
      className={`font-semibold tracking-tight text-[22px] md:text-[24px] text-[#F5E6C8] ${className}`}
    >
      {showText && 'ToSom'}
    </span>
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