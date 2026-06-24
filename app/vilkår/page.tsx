'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VilkarRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/vilkar');
  }, [router]);

  return (
    <main className="relative min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
      <div className="text-center space-y-4">
        <p className="text-white/60 text-lg">Omdirigerer...</p>
      </div>
    </main>
  );
}