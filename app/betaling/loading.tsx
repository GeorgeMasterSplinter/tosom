'use client';
/** P-2: Loading-skjelett på /betaling */
export default function BetalingLoading() {
  return (
    <div className="min-h-screen bg-[#0B1520] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
        <p className="text-white/30 text-sm">Laster betaling…</p>
      </div>
    </div>
  );
}