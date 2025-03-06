/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  verbose: true,
  // collectCoverage: true,
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
};