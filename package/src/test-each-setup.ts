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
  maxTestNameLength: number;
};

export const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
  concurrent: false,
  maxTestNameLength: 200,
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
    pending,
  },
});

export const TestEachEnv = (env: Env) => {
  userEnv.env = env;
};
