module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: '<rootDir>/test/coverage',
  displayName: 'crudl',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
