export type Runner = (name: string, body: () => void) => void;
export type BeforeAfter = (fn: (cb: any) => any, timeout?: number) => void;

export type Env = {
  describe: Runner;
  it: Runner;
  itOnly: Runner;
  itConcurrent: Runner;
  beforeAll: BeforeAfter; // not used in test-each for now
  beforeEach: BeforeAfter; // not used in test-each for now
  afterEach: BeforeAfter; // not used in test-each for now
  afterAll: BeforeAfter; // not used in test-each for now
};