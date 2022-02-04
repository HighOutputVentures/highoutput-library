module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  verbose: true,
  maxWorkers: '50%',
  testTimeout: 10000,
  testRegex: '/__tests__/.*.test.ts$',
};
