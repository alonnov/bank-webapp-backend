// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src', '<rootDir>/test'],
//   testMatch: ['**/test/**/*.test.ts'],
//   transform: {
//     '^.+\\.ts$': 'ts-jest',
//   },
//   collectCoverageFrom: [
//     'src/**/*.ts',
//     '!src/**/*.d.ts',
//     '!src/index.ts',
//     '!src/types/**/*'
//   ],
//   coverageDirectory: 'coverage',
//   coverageReporters: ['text', 'lcov', 'html'],
//   setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
//   moduleNameMapping: {
//     '^@/(.*)$': '<rootDir>/src/$1'
//   }
// }; 

// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' } // not moduleNameMapping
};