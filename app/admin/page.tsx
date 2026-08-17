'use client';

/**
 * Tosom — Admin Root Page
 * 
 * Redirect til /admin/login (automatisk).
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRoot() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0A1A2A' }}>
      <div className="w-8 h-8 border-2 border-[rgba(212,175,55,0.3)] border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );
}