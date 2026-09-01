"use client";

/** PartnerProfileDemo — test PartnerProfileView uten dashboard
 *  PP11 — opprett demo-komponent
 *  PP12 — dummy journeyState (currentDay: 12, photosAllowed: false)
 *  PP13–PP14 — knapper for fasebytte og open/lukk modal
 *  PP15 — koble dummy-profil
 *  PP16 — vis kompatibilitet
 *  PP19 — bokmål, varmt, rolig, kort
 *  PP20 — ingen interaktiv logikk */

import { useState } from "react";
import PartnerProfileView from "./PartnerProfileView";
import { dummyProfile } from "../../lib/profile/partnerProfile";

export default function PartnerProfileDemo() {
  const [visible, setVisible] = useState(false);
  const [photosAllowed, setPhotosAllowed] = useState(false);

  /* PP14 — onClose */
  const handleClose = () => {
    console.log("close partner profile");
    setVisible(false);
  };

  return (
    <div className="max-w-md mx-auto p-8">
      {/* PP14 — Åpne/lukk modal */}
      <button
        onClick={() => setVisible((v) => !v)}
        className="px-4 py-2 text-sm rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      >
        {visible ? "Skjul partnerprofil" : "Vis partnerprofil"}
      </button>

      {/* PP13 — Fasebytte-knapper */}
      {visible && (
        <div className="mt-4 bg-white/60 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <p className="text-xs font-medium text-[#4A4A4A]">Demo-kontroll</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPhotosAllowed(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
            >
              Åpne bilder
            </button>
            <button
              onClick={() => setPhotosAllowed(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
            >
              Lås bilder
            </button>
          </div>
          <p className="text-xs text-[#4A4A4A]/50">
            {photosAllowed ? "Bilder er åpne" : "Bilder er låst"}
          </p>
        </div>
      )}

      {/* PP15 — PartnerProfileView med dummy-profil */}
      {visible && (
        <PartnerProfileView
          profile={dummyProfile}
          photosAllowed={photosAllowed}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
