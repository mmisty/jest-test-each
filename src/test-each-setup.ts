import { Env } from './test-env';

export type TestSetupType = {
  numericCases: boolean;
  groupBySuites: boolean;
};

export const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
};

export const testConfig: { config: TestSetupType } = {
  config: testConfigDefault,
};

export const TestEachSetup = (config: Partial<TestSetupType>) => {
  testConfig.config = { ...testConfigDefault, ...config };
};

export const testEnv: { env: Env } = {
  env: {
    beforeEach,
    beforeAll,
    afterAll,
    afterEach,
    testRunner: it,
    suiteRunner: describe,
  },
}; // todo may need to setup
export const TestEachEnv = (env: Env) => {
  testEnv.env = env;
};
