module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./tests/globalSetup.ts",
  setupFilesAfterEnv: ["./tests/setupFilesAfterEnv.ts"],
};
