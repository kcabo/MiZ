module.exports = {
  moduleDirectories: ['src', 'node_modules'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
