import { TestEach } from './test-each';
import { TestEachSetup, TestEachEnv } from './test-each-setup';

type TestEachFunc = (desc?: string) => TestEach;

declare global {
  export const its: TestEachFunc;
  export const Test: TestEachFunc;
}

const createTest = (desc?: string) => new TestEach(desc);

(global as any).Test = createTest;
(global as any).its = createTest;

export { TestEachSetup, TestEachEnv };
