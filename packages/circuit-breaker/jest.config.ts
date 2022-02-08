import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      useESM: true,
      isolatedModules: true,
    },
  },
  testEnvironment: 'node',
  bail: 1,
  verbose: true,
  maxWorkers: '50%',
  testTimeout: 10000,
  testRegex: '/__tests__/.*.test.ts$',
};

export default config;
