/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',

  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/ms-transactions/src/domain/',
    '/ms-api-mock/src/domain/',
    '/ms-payments/src/domain/',
    '/ms-transactions/src/domain/',
  ],
  coveragePathIgnorePatterns: [
    `/node_modules/`,
    '/ms-transactions/src/domain/',
    '/ms-api-mock/src/domain/',
    '/ms-payments/src/domain/',
    '/ms-transactions/src/domain/',
  ],
};

module.exports = config;
