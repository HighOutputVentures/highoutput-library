module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: {
    '^@libraries/(.*)$': '<rootDir>/libraries/$1',
  },

  testEnvironment: 'node',
  maxWorkers: '50%',
  testTimeout: 10_0000,
  testMatch: ['**/**/*.spec.ts'],

  bail: 1,
  verbose: true,
  watchman: false,

  collectCoverageFrom: [
    '__test__/*.spec.ts',
    'src/*.ts',
  ],
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 80,
    },
  },
};
