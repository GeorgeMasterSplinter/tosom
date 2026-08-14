/* ═══════════════════════════════════════════
   ToSom ProfileSecurityCard — Design System 1.1
   Viser at profilen er privat og trygg.
   Bruk i profile-sider for å trygge brukaren.
   ═══════════════════════════════════════════ */

'use client';

interface ProfileSecurityCardProps {
  showDetails?: boolean;
}

export const ProfileSecurityCard = ({ showDetails = false }: ProfileSecurityCardProps) => {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: 'rgba(212, 175, 55, 0.04)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
      }}
    >
      {/* Hovudseksjon */}
      <div className="flex items-start gap-4 mb-4">
        {/* Lås-ikon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="flex-1">
          <h3
            className="text-lg font-semibold mb-1"
            style={{ color: '#FFFFFF' }}
          >
            Din profil er privat
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Berre din match kan se profilen din. Ingen andre brukere har tilgang.
          </p>
        </div>
      </div>

      {/* Detaljar */}
      {showDetails && (
        <div
          className="mt-4 pt-4 border-t animate-fadeIn"
          style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}
        >
          <ul className="space-y-2">
            {[
              'Profildata er kryptert og lagra sikkert',
              'Bilete delast først etter 14 dagar',
              'Du kan når som helst slette profilen din',
              'Ingen deling med tredjepart',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  className="flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  className="text-sm"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSecurityCard;