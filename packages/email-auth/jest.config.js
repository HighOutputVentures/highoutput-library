module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],

  bail: 1,
  verbose: true,
  watchman: false,

  collectCoverageFrom: ['src/lib/*.ts'],
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
