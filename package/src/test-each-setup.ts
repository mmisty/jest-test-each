import { Env } from './test-env';

export type TestSetupType = {
  numericCases: boolean; // number suites and case in each suite
  groupBySuites: boolean; // group tests by suites when cases multiplication
  concurrent: boolean; // run tests concurrently
  maxTestNameLength: number;
};

export const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
  concurrent: false,
  maxTestNameLength: 100,
};

export const testConfig: { config: TestSetupType } = {
  config: testConfigDefault,
};

export const TestEachSetup = (config: Partial<TestSetupType>) => {
  testConfig.config = { ...testConfigDefault, ...config };
};
export const userEnv: { env?: Env } = {};

export const testEnvDefault: () => { env: Env } = () => ({
  env: {
    beforeEach,
    beforeAll,
    afterAll,
    afterEach,
    it,
    describe,
  },
});

export const TestEachEnv = (env: Env) => {
  userEnv.env = env;
};
