module.exports = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$",
  setupFilesAfterEnv: ["./config/setup.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
};
