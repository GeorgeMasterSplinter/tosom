import Link from 'next/link';

export default function PrimaryButtons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 animate-[fadeIn_0.6s_ease-out]">
      <Link href="/chat" className="block w-full">
        <div className="w-full py-6 px-8 rounded-xl text-lg font-medium bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-white/80 hover:bg-[rgba(255,255,255,0.10)] transition-all duration-300 ease-out text-center">
          Gå til samtalen
        </div>
      </Link>
      <Link href="/dashboard/journey" className="block w-full">
        <div className="w-full py-6 px-8 rounded-xl text-lg font-medium bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-white/80 hover:bg-[rgba(255,255,255,0.10)] transition-all duration-300 ease-out text-center">
          Se reisen
        </div>
      </Link>
      <Link href="/profile" className="block w-full">
        <div className="w-full py-6 px-8 rounded-xl text-lg font-medium bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-white/80 hover:bg-[rgba(255,255,255,0.10)] transition-all duration-300 ease-out text-center">
          Oppdater profil
        </div>
      </Link>
      <Link href="/dashboard/settings" className="block w-full">
        <div className="w-full py-6 px-8 rounded-xl text-lg font-medium bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-white/80 hover:bg-[rgba(255,255,255,0.10)] transition-all duration-300 ease-out text-center">
          Innstillinger
        </div>
      </Link>
    </div>
  );
}
