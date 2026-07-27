/**
 * ToSom — Global Header Wrapper (Route-Based Conditional)
 * 
 * Kun landing og auth-sider får AppHeader.
 * Dashboard, settings, journey, profile, chat, onboarding har egne headers.
 */

'use client';

import { usePathname } from 'next/navigation';
import AppHeader from '@/components/ui/layout/AppHeader';

// Sider som IKKE skal ha GlobalHeader (de har egne header-komponenter)
const NO_HEADER_PATHS = new Set([
  '/dashboard',
  '/onboarding',
  '/settings',
  '/journey',
  '/profile',
  '/chat',
  '/match',
]);

interface GlobalHeaderWrapperProps {
  children: React.ReactNode;
}

export default function GlobalHeaderWrapper({ children }: GlobalHeaderWrapperProps) {
  const pathname = usePathname();
  
  // Server-safe check: pathname can be null during SSR, default to false
  const shouldShowHeader = pathname !== null && (
    !NO_HEADER_PATHS.has(pathname) && 
    !pathname.startsWith('/dashboard') && 
    !pathname.startsWith('/onboarding') && 
    !pathname.startsWith('/settings') && 
    !pathname.startsWith('/journey') && 
    !pathname.startsWith('/profile') && 
    !pathname.startsWith('/chat')
  );

  return (
    <>
      {shouldShowHeader && (
        <header className="relative z-50 mb-10">
          <AppHeader />
        </header>
      )}
      {children}
    </>
  );
}
