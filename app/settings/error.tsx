'use client';
import { useEffect } from 'react';
export default function SettingsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { try { const Sentry = require('@sentry/nextjs'); Sentry.captureException(error); } catch {} }, [error]);
  return (<div className="min-h-screen bg-[#0B1520] flex items-center justify-center p-8"><div className="text-center max-w-md"><p className="text-xl font-bold mb-2" style={{color:'#D4AF37'}}>Noe gikk galt hos oss</p><p className="text-white/50 mb-6">Vi ser på det. Prøv igjen om litt.</p><button onClick={reset} className="px-6 py-3 rounded-xl font-medium" style={{background:'linear-gradient(135deg,#D4AF37,#E8C766)',color:'#0B1520'}}>Prøv igjen</button></div></div>);
}
