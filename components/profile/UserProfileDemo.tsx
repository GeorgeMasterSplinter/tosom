"use client";

/** UserProfileDemo — test UserProfileView uten dashboard
 *  UP21 — opprett demo-komponent
 *  UP22 — dummy userProfile
 *  UP23–UP24 — knapper for open/lukk modal + logg endringer
 *  UP25–UP28 — test av readyForMatch, chips, bilder, bio
 *  UP29 — bokmål, varmt, rolig, kort
 *  UP30 — ingen nye features */

import { useState } from "react";
import UserProfileView from "./UserProfileView";
import { dummyUserProfile } from "../../lib/profile/userProfile";
import type { UserProfile } from "../../lib/profile/userProfile";

export default function UserProfileDemo() {
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(dummyUserProfile);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  /* UP24 — Logg endringer */
  const handleUpdate = (updated: UserProfile) => {
    console.log("Updated profile:", updated);
    setProfile(updated);
  };

  return (
    <div className="max-w-md mx-auto p-8 space-y-4">
      {/* UP23 — Åpne modal */}
      <button
        onClick={handleOpen}
        className="px-4 py-2 text-sm rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      >
        Vis min profil
      </button>

      {/* Vis gjeldande profil-status */}
      {visible && (
        <div className="bg-white/60 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-xs text-[#4A4A4A]/50">
            Klar for match: {profile.readyForMatch ? "Ja" : "Nei"} |
            Verdier: {profile.values.length} |
            Interesser: {profile.interests.length} |
            Bilder: {profile.photos.length}
          </p>
        </div>
      )}

      {/* UP22 — UserProfileView med dummy-profil */}
      {visible && (
        <UserProfileView
          profile={profile}
          onUpdate={handleUpdate}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
