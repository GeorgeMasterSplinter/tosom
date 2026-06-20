"use client";

import ReflectionBox from "./ReflectionBox";
import JourneySummary from "./JourneySummary";

export default function DashboardBottom() {
  return (
    <div className="bg-white/60 rounded-xl p-6 space-y-8">
      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Dagens innsikt</h3>
        <p className="text-sm leading-relaxed text-[#4A4A4A]">
          Du har en liten innsikt tilgjengelig i dag. Ta deg tid til å reflektere.
        </p>
        <div className="mt-3 bg-[#F7F1E3] p-3 rounded-lg text-sm leading-relaxed">
          Dagens sitat kommer her.
        </div>
      </div>

      <div className="h-px bg-black/5" />

      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Neste steg</h3>
        <p className="text-sm leading-relaxed text-[#4A4A4A]">
          Fortsett reisen din. Du er på rett vei.
        </p>
        <JourneySummary journeyStatus="in_progress" />
      </div>

      <div className="h-px bg-black/5" />

      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Refleksjonslogg</h3>
        <div className="space-y-4">
          <ReflectionBox reflectionText="Dagens refleksjon" />
        </div>
      </div>
    </div>
  );
}
