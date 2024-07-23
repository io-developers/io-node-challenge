module.exports = {
  verbose: true,
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "test",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.{js,ts,tsx}",
    "!**/node_modules/**"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/"
  ],
  testMatch: [
    '**/*.steps.ts'
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  collectCoverage: true
}