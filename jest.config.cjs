/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  testMatch: [
    '**/__tests__/**/*.test.(js|jsx|ts|tsx)',
    '**/__tests__/**/*.spec.(js|jsx|ts|tsx)',
  ],

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },

  transformIgnorePatterns: [
    'node_modules/(?!(@faker-js/faker)/)',
  ],

  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  clearMocks: true,
};

module.exports = config;
