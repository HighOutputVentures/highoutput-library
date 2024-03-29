/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  verbose: true,
  maxWorkers: 1,
  testTimeout: 5000000,
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  /* bazel copies files using symlinks */
  /* jest doesn't like symlinks by default */
  /* enable symlinks and disable watchman to use symlinks */
  haste: {
    enableSymlinks: true,
  },
  watchman: false,
};
