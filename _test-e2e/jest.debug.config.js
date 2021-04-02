const config = require('./jest.config');
module.exports = {
  ...config,
  setupFilesAfterEnv: ['./src/config/jest.debug.setup.js'],
  moduleNameMapper: {
    'jest-test-each': '<rootDir>/../src/index.ts',
  },
};
