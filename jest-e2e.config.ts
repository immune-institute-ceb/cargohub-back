export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  // Update testMatch to match files like "auth-e2e.spec.ts" in test/e2e folder
  testMatch: ['**/test/e2e/*-e2e.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testSequencer: '<rootDir>/test/testSequencer.js',
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  modulePaths: ['<rootDir>'],
  testTimeout: 30000,
};
