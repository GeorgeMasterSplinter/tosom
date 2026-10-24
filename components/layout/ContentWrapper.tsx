/**
 * Tosom — ContentWrapper
 *
 * Kondisjonell top-padding: legger på pt-[64px] kun når UniversalMenu er synlig.
 * På store skjermer (xl) er menyen 2 rader og headeren høyere (116px),
 * derfor xl:pt-[116px].
 * (altså ikke på app-sider som /dashboard, /chat, /settings, /onboarding, /dev-login).
 */

'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_ROUTES = [
  '/dashboard',
  '/chat',
  '/settings',
  '/onboarding',
  '/dev-login',
  '/admin',
];

const isHiddenRoute = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return HIDDEN_ROUTES.some(route => pathname.startsWith(route));
};

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  // Ingen padding hvis UniversalMenu er skjult
  if (isHiddenRoute(pathname)) {
    return <>{children}</>;
  }

  return <div className="pt-[64px] xl:pt-[116px]">{children}</div>;
};

export default ContentWrapper;