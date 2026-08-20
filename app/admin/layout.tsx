/**
 * Tosom — Admin Root Layout (pass-through)
 *
 * Kun mørk bakgrunn + metadata. Sidebar og content-ramme håndteres i
 * rutegruppens layout: app/admin/(panel)/layout.tsx.
 *
 * /admin/login ligger utenfor (panel) og vises uten sidebar.
 * Ingen header-lesing, ingen strengsammenligning av stier.
 */

export const metadata = {
  title: 'Tosom Admin',
  description: 'Administrasjonspanel for Tosom-plattformen',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#0B1520' }}>
      {children}
    </div>
  );
}