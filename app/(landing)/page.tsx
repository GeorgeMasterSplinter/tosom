"use client";

import LandingView from "./LandingView";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { enableDemoMode, isDemoMode } from "@/lib/demoMode";

export default function LandingPage() {
  const router = useRouter();

  const goToDemo = useCallback(() => {
    enableDemoMode();
    router.push("/dashboard?demo=1");
  }, [router]);

  // If demo mode is active, redirect immediately
  useEffect(() => {
    if (isDemoMode()) {
      router.push("/dashboard?demo=1");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <LandingView />

      {/* Demo-knapp nederst til venstre */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={goToDemo}
          className="px-3 py-2 text-xs text-white/60 hover:text-gold border border-white/10 hover:border-gold/30 rounded-lg transition-all duration-200 bg-white/5 hover:bg-gold/10"
        >
          Demo-modus
        </button>
      </div>
    </main>
  );
}