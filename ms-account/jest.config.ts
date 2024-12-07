module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  silent: true,
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: ['./src/**'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  modulePaths: ['<rootDir>/src/'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '__mocks__'],
  moduleFileExtensions: ['js', 'json', 'ts', 'node', 'jsx', 'tsx'],
  testRegex: '/test/.*\\.(spec|test)\\.[tj]sx?$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  roots: ['<rootDir>/test'],
  verbose: true,
};
