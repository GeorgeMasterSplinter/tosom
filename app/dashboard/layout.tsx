/**
 * Tosom — Dashboard Layout (cleaned 2026)
 *
 * Server-komponent med TC-11 noindex-metadata. Providers + navigasjon ligger
 * i DashboardShell ('use client' fordi context-providers er klient-komponenter).
 * Alt innhold styres av page.tsx.
 */

import type { Metadata } from 'next';
import DashboardShell from './DashboardShell';

// TC-11: privat brukerområde — skal ikke indexeres.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}