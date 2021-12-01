module.exports = {
  moduleDirectories: ['src', 'node_modules'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/test', '<rootDir>/src'],
};
