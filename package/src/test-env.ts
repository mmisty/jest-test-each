export type Runner = (name: string, body: () => void) => void;
export type BeforeAfter = (fn: (cb: any) => any, timeout?: number) => void;

export interface TestRunner {
  (name: string, body: () => void, timeout?: number): void;
  only: TestRunner;
  skip: TestRunner;
  todo: TestRunner;
  concurrent: TestRunner;
}

export type Env = {
  describe: Runner;
  it: TestRunner;
  beforeAll: BeforeAfter; // not used in test-each for now
  beforeEach: BeforeAfter; // not used in test-each for now
  afterEach: BeforeAfter; // not used in test-each for now
  afterAll: BeforeAfter; // not used in test-each for now
  pending: (reason?: string) => void;
};
