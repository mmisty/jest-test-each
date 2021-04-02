import { createTest,TestEachFunc } from './test-each';

export type Runner = (name: string, body: () => void) => void;

export type Env = {
  suiteRunner: Runner;
  testRunner: Runner;
};

declare global {
  export const its: TestEachFunc;
  export const Test: TestEachFunc;
}

(global as any).Test = createTest;
(global as any).its = createTest;

import { TestEachSetup, TestEach } from './test-each';
export { TestEachSetup, TestEach };
