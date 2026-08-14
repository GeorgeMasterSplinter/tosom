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
  // STEG 4.6: Exclude Playwright e2e tests from Jest
  // B0.8/lang: setup.ts er en delingsfil (ikke en test-suite) — utelukk slik at
  // den ikke feiler med "must contain at least one test" (blokkerte npm test/CI).
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/', 'setup\\.ts$'],
}

module.exports = createJestConfig(customJestConfig)