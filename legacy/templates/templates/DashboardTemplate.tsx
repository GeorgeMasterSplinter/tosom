/**
 * DashboardTemplate — Full dashboard page layout
 *
 * Usage:
 *   <DashboardTemplate
 *     user={user}
 *     sidebar={<Sidebar />}
 *   >
 *     <DashboardContent />
 *   </DashboardTemplate>
 */

import React from 'react';

export interface DashboardTemplateProps {
  /** Page children */
  children: React.ReactNode;
  /** User info */
  user?: { name: string; avatar?: string };
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Top actions */
  topActions?: React.ReactNode;
  /** Stats row */
  stats?: Array<{ label: string; value: string | number; icon?: string }>;
  /** Show search */
  search?: boolean;
  /** Custom class */
  className?: string;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  user,
  sidebar,
  topActions,
  stats,
  search,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-ts-bg-primary ${className}`}>
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-ts-bg-primary/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-ts-gold/20 flex items-center justify-center border border-white/10">
                <span className="text-xs font-semibold text-ts-gold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="text-sm font-medium text-ts-primary">{user?.name || 'Brukar'}</span>
          </div>
          <div className="flex items-center gap-3">
            {topActions}
          </div>
        </div>
      </nav>

      {/* Stats row */}
      {stats && (
        <div className="border-b border-white/5 bg-ts-glass/20">
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                {s.icon && <span className="text-lg">{s.icon}</span>}
                <p className="text-2xl font-bold text-ts-primary">{s.value}</p>
                <p className="text-xs text-ts-text-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 border-r border-white/5 min-h-[calc(100vh-8rem)] p-4 bg-ts-glass/10">
            {sidebar}
          </aside>
        )}

        {/* Content area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

DashboardTemplate.displayName = 'DashboardTemplate';
export default DashboardTemplate;