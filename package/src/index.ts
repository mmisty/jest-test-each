import { TestEach } from './test-each';
import { TestEachSetup, TestEachEnv } from './test-each-setup';

const createTest = <T = {}, B = {}>(desc?: string) => new TestEach<T, B>(desc);

(global as any).Test = createTest;
(global as any).its = createTest;

type TestEachFunc = (desc?: string) => TestEach;

declare global {
  export const its: TestEachFunc;
  export const Test: TestEachFunc;
}

export { TestEachSetup, TestEachEnv };
