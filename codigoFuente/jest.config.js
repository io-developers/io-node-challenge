module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/src/payments/domain/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  coveragePathIgnorePatterns: [
    `/node_modules/`,
    "/src/payments/domain/",
    "/src/payments/aplication/",
    "/src/mockPayments/domain/",
    "/src/mockPayments/aplication/",
    "/src/activity/domain/",
    "/src/activity/application/",
    "/src/user/domain/",
    "/src/user/application/",
  ],
};
