/**
 * ToSom — Global Header Component
 * 
 * Konsistent header med ToSom-logo og "Made in Norway" under.
 * Importer fra '@/components/global/GlobalHeader' for bruk i alle layouts.
 */

'use client';

import { ToSomLogo } from './ToSomLogo';

interface GlobalHeaderProps {
  className?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ className = '' }) => {
  return (
    <header className={`mb-10 text-center ${className}`}>
      <ToSomLogo href="/" showTagline />
    </header>
  );
};

export default GlobalHeader;