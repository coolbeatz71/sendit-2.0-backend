module.exports = {
  collectCoverage: true,
  globalSetup: './src/setup-jest.ts',
  globalTeardown: './src/teardown-jest.ts',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|js)',
    '!<rootDir>/src/index.(ts|js)',
    '!**/node_modules/**',
    '!<rootDir>/src/database/**',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/?(*.)(spec|test).(ts|js)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|js)',
  ],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'node',
};
