module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./tests/globalSetup.ts",
  globalTeardown: "./tests/globalTeardown.ts",
  setupFilesAfterEnv: ["./tests/setupFilesAfterEnv.ts"],
  testTimeout: 60000,
  slowTestThreshold: 30,
};
