import { Env } from './test-env';

export type TestSetupType = {
  numericCases: boolean;
  groupBySuites: boolean;
  concurrent: boolean;
};

export const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
  concurrent: false,
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
    itOnly: it.only, // todo
    itConcurrent: it.concurrent, // todo
    describe,
  },
}); // todo may need to setup
export const TestEachEnv = (env: Env) => {
  userEnv.env = env;
};
