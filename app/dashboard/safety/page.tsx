/**
 * ToSom Dashboard 1.0 — Safety Features
 * Premium side med trygghetsfunksjoner, nødkontakt og personverninnstillinger.
 */

'use client';

interface SafetyFeature {
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
}

interface PrivacySetting {
  title: string;
  description: string;
  value: boolean;
}

const safetyFeatures: SafetyFeature[] = [
  { title: 'Verifisert profil', description: 'Alle profiler er manuelt verifisert for økt trygghet.', icon: '🛡️', active: true },
  { title: 'Sikker meldingskanal', description: 'Alle meldinger er end-to-end-kryptert.', icon: '🔒', active: true },
  { title: 'Blokkeringsfunksjon', description: 'Blokker uønskede kontakter enkelt.', icon: '🚫', active: true },
  { title: 'Nødkontakt-støtte', description: 'Få tilgang til støttepersoner ved behov.', icon: '🆘', active: false },
];

const emergencyContacts: EmergencyContact[] = [
  { name: 'Din nødkontakt', role: 'Støtteperson', phone: '+47 XXX XX XXX' },
  { name: 'ToSom Support', role: 'Plattform-støtte', phone: 'support@tosom.no' },
  { name: 'Krisetelefonen', role: 'Eksperthjelp', phone: '22 40 00' },
];

const privacySettings: PrivacySetting[] = [
  { title: 'Skjul profil for ukjente', description: 'Kun din match kan se profilen din.', value: true },
  { title: 'Skjul aktivitet-status', description: 'Vis ikke når du er online.', value: true },
  { title: 'Del plasseringsdata', description: 'Bruk plassering for bedre matcher.', value: false },
];

export default function SafetyPage() {
  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Trygghet
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          Dine trygghetsfunksjoner, nødkontakter og personverninnstillinger.
        </p>
      </div>

      {/* Safety Features */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Trygghetsfunksjoner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, i) => (
            <div
              key={i}
              className={`
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-2xl p-6 ts-shadow-card animate-fadeIn
                ${feature.active ? 'border-[var(--ts-gold)]' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-[var(--ts-text-soft)] text-sm leading-[1.6]">
                    {feature.description}
                  </p>
                  <span className={`
                    inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full
                    ${feature.active
                      ? 'bg-[var(--ts-gold-soft)] text-[var(--ts-gold)]'
                      : 'bg-[var(--ts-bg-hover)] text-[var(--ts-text-soft)]'
                    }
                  `}>
                    {feature.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Nødkontakter</h2>
        <div className="space-y-4">
          {emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-5 ts-shadow-card animate-fadeIn
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--ts-text)] font-medium">{contact.name}</p>
                  <p className="text-[var(--ts-text-soft)] text-sm mt-1">{contact.role}</p>
                </div>
                <span className="text-[var(--ts-gold)] text-sm">{contact.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Settings */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Personvern</h2>
        <div className="space-y-4">
          {privacySettings.map((setting, i) => (
            <div
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-5 ts-shadow-card animate-fadeIn
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--ts-text)] font-medium">{setting.title}</p>
                  <p className="text-[var(--ts-text-soft)] text-sm mt-1">{setting.description}</p>
                </div>
                <div className={`
                  w-12 h-6 rounded-full cursor-pointer transition-all duration-300
                  ${setting.value ? 'bg-[var(--ts-gold)]' : 'bg-[var(--ts-bg-hover)]'}
                `}>
                  <div className={`
                    w-5 h-5 rounded-full bg-white shadow transition-transform duration-300
                    ${setting.value ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}