module.exports = {
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  modulePaths: ['<rootDir>/src/'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!aws-sdk-client-mock/)'],
};
