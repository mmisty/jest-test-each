import { TestEach } from './test-each';
import { TestEachSetup, TestEachEnv } from './test-each-setup';

const createTest = (desc?: string) => new TestEach(desc);

(global as any).Test = createTest;
(global as any).its = createTest;

export { TestEachSetup, TestEachEnv };
