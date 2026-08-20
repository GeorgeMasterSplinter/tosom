/**
 * Tosom — Admin Panel Layout (sidebar + content)
 *
 * Alle admin-sider under rutegruppen (panel) får automatisk:
 * - Sidebar-navigasjon til venstre (240px)
 * - Content-område som skyves til høyre
 * - Mørk bakgrunn #0B1520
 *
 * Rutegruppen påvirker ikke URL-ene: /admin/dashboard forblir /admin/dashboard.
 * /admin/login ligger UTENFOR gruppen og får derfor ingen sidebar.
 */

import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#0B1520' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content — skyves til høyre av sidebar */}
      <div className="min-h-screen transition-all duration-300" style={{ marginLeft: '240px' }}>
        <main className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}