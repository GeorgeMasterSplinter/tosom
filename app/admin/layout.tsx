import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="/admin" 
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Users
              </a>
            </li>
            <li>
              <a 
                href="/admin/matches" 
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Matches
              </a>
            </li>
            <li>
              <a 
                href="/admin/journey" 
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Journey
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}