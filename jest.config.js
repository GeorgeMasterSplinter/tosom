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
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/'],
}

module.exports = createJestConfig(customJestConfig)