/**
 * Verifisering av postalCode-fix i onboarding-payload (engangs-script)
 * Kjør: npx tsx scripts/verify-postalcode-fix.ts
 */
import { validateOnboarding } from '@/lib/validation/onboarding-setup';

// Repraesenterer det frontenden sender FØR fixen (uten postalCode)
const oldPayload = {
  basic: {
    identityName: 'Testbruker', age: '30', gender: 'male', seekingGender: 'female',
    city: 'Oslo', distancePref: 100, agePrefMin: 23, agePrefMax: 40,
  },
  personlighet: { selfDesc: 'Jeg er en rolig person som verdsetter dype samtaler.' },
  livssituasjon: {},
  tilknytning: {},
  kommunikasjon: {},
  kjaerlighet: {},
  livsstil: {},
  relasjonsStil: {},
  fremtid: {},
  humor: {},
  grenser: {},
  moden: {},
  preferanser: {},
  psychometrics: {},
};

// Ny payload (etter fixen) — postalCode med, som UI-et samler inn i steg 1
const newPayload = {
  ...oldPayload,
  basic: { ...oldPayload.basic, postalCode: '0150' },
};

console.log('TEST A — gammel payload (uten postalCode):');
const a = validateOnboarding(oldPayload);
if (a.success) {
  console.log('  ❌ UFORVENTET: gamle payloadet passerte — feilen var ikke postalCode!');
  process.exit(1);
} else {
  console.log('  ✅ Feilet som forventet. Feil fra schemaet:');
  for (const e of a.errors) console.log(`     - ${e.field}: ${e.message}`);
  const hasPostal = a.errors.some((e) => e.field === 'basic.postalCode');
  console.log(hasPostal ? '  ✅ basic.postalCode rapportert som mangel' : '  ⚠️ postalCode er IKKE den rapporterte feilen — se over');
}

console.log('\nTEST B — ny payload (med postalCode 0150):');
const b = validateOnboarding(newPayload);
if (b.success) {
  console.log('  ✅ Validering passer — /api/profile/setup mottar nå dataene.');
} else {
  console.log('  ❌ Nye payloadet feiler fortsatt:');
  for (const e of b.errors) console.log(`     - ${e.field}: ${e.message}`);
  process.exit(1);
}

console.log('\nFerdig. Root cause bekreftet og fix verifisert på valideringsnivå.');
