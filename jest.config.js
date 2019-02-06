module.exports = {
    testMatch: ['**/__test__/*.js'],
    modulePathIgnorePatterns: ['<rootDir>/build/'],
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
    testEnvironment: 'node',
    clearMocks: true,
};
