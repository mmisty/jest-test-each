import { TestEach } from './test-each';

type TestEachFunc = (desc?: string) => TestEach;

declare global {
  export const its: TestEachFunc;
  export const Test: TestEachFunc;
}
