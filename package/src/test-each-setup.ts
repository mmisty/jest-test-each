import { Env } from './test-env';

export type TestSetupType = {
  /**
   * Number suites and cases in each suite
   */
  numericCases: boolean;
  /**
   * Group tests by suites when cases are multiplied
   */
  groupBySuites: boolean;
  /**
   * Run tests concurrently (for jest -> it.concurrent)
   */
  concurrent: boolean;
  /**
   * Max length of case name - on reaching it will ask to sepcify explicit description for case
   */
  // todo full name check
  testSuiteName: {
    maxLength: number; // be aware - teamcity doesn't show test results which names are longer than 512
    failOnReached: boolean;
  };
};

export const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
  concurrent: false,
  testSuiteName: {
    maxLength: 200,
    failOnReached: true,
  },
};

export const testConfig: { config: TestSetupType } = {
  config: testConfigDefault,
};

export const TestEachSetup = (config: Partial<TestSetupType>) => {
  testConfig.config = { ...testConfig.config, ...config };
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
    pending,
  },
});

export const TestEachEnv = (env: Env) => {
  userEnv.env = env;
};
