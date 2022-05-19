module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: {
    '^@libraries/(.*)$': '<rootDir>/libraries/$1',
  },

  testEnvironment: 'node',
  maxWorkers: '50%',
  testTimeout: 5_000,
  testMatch: ['**/**/*.spec.ts'],

  bail: 1,
  verbose: true,
  watchman: false,

  collectCoverageFrom: [
    'src/!(server).ts',
  ],
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
