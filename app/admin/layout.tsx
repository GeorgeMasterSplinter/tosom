/**
 * Tosom — Admin Root Layout (med sidebar + content wrapper)
 *
 * Alle sider under /admin/ får automatisk:
 * - Sidebar-navigasjon til venstre (240px)
 * - Content-område med padding ml-60 (for å unngå sidebar)
 * - Mørk bakgrunn #0B1520
 *
 * UNNTAK: /admin/login vises UTEsidebar.
 *
 * IMPORTANT: Next.js App Router layouts er ADDITIVE — parent layout
 * renderes ALLTID sammen med child layouts. Derfor sjekker vi pathname
 * direkte her i stedet for å stole på barns layout-override.
 */

import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Tosom Admin',
  description: 'Administrasjonspanel for Tosom-plattformen',
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hent pathname fra request URL via headers
  const headerStore = await headers();
  const url = new URL(headerStore.get('x-url') || headerStore.get('referer') || 'http://localhost/admin/dashboard');
  const pathname = url.pathname;
  const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  if (isLogin) {
    // Login-siden: kun mørk bakgrunn + children, INGEN sidebar
    return (
      <div className="min-h-screen" style={{ background: '#0B1520' }}>
        {children}
      </div>
    );
  }

  // Alle andre admin-sider: sidebar + content wrapper
  return (
    <div className="min-h-screen" style={{ background: '#0B1520' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content — skyves til høyre av sidebar */}
      <div
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: '240px' }}
      >
        <main className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}