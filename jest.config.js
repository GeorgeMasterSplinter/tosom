const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // S-10: Integrasjonstestene (endJourney, s9-deletion, privacy-anonymize) deler
  // ÉN test-DB (DATABASE_URL=TEST_DATABASE_URL) og bruker felles global
  // deleteMany-cleanup i integration/setup.ts beforeEach. I parallel kjører
  // én suites cleanup bort dataet til en annen suite som kjører samtidig
  // (flak). Kjør derfor serialt (maxWorkers=1) slik at DB-suitene ikke
  // overlappler. Enhetstestene er raske og bruker ikke DB — liten pris.
  maxWorkers: 1,
  // STEG 4.6: Exclude Playwright e2e tests from Jest
  // B0.8/lang: setup.ts er en delingsfil (ikke en test-suite) — utelukk slik at
  // den ikke feiler med "must contain at least one test" (blokkerte npm test/CI).
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/', 'setup\\.ts$'],
}

module.exports = createJestConfig(customJestConfig)