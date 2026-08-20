/**
 * Tosom — ContentWrapper
 *
 * Kondisjonell top-padding: legger på pt-[64px] kun når UniversalMenu er synlig
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

  return <div className="pt-[64px]">{children}</div>;
};

export default ContentWrapper;