module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/*.spec.ts', '!src/main.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
