module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    moduleNameMapper: {
        '^application/(.*)$': '<rootDir>/src/application/$1',
        '^domain/(.*)$': '<rootDir>/src/domain/$1',
        '^infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    },
};
