/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  verbose: true,
  maxWorkers: '74%',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['dist'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
