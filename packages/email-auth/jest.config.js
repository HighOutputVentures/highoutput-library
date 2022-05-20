module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',
  maxWorkers: '50%',
  testTimeout: 5_000,
  testMatch: ['**/*.spec.ts'],

  bail: 1,
  verbose: true,
  watchman: false,

  collectCoverageFrom: [
    'src/!(server).ts',
  ],
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
