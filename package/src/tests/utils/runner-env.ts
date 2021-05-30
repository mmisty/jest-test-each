import { TestEach } from '../../test-each';
import { TestEachEnv, TestEachSetup } from '../../index';
import { Env, Runner, TestRunner } from '../../test-env';
import { delay } from './utils';

const stripAnsi = require('strip-ansi');

const TestEachTesting = (env: Partial<Env>) => (desc?: string) => {
  TestEachEnv(env);
  return new TestEach(desc);
};

type ResultType = {
  failures: Failure[];
  passes: Pass[];
  totalEntities: number;
  suites: string[];
  tests: string[];
  skips: string[];
};

export const result: ResultType = {
  failures: [],
  passes: [],
  totalEntities: 0,
  suites: [],
  tests: [],
  skips: [],
};

const started: { s: string[] } = { s: [] };
// todo think
export const cleanup = () => {
  started.s = [];
  result.failures = [];
  result.passes = [];
  result.totalEntities = 0;

  result.suites = [];
  result.tests = [];
  result.skips = [];
  TestEachSetup({ groupBySuites: true, numericCases: false });
};

type Pass = {
  name: string;
};

type Failure = {
  name: string;
  message: string;
};

const suiteRunner: Runner = (name: string, body: () => void) => {
  // console.log('Suite started: ' + name);
  result.totalEntities++;
  result.suites.push(name);
  body();
};

export const waitFinished = async () => {
  for (let i = 0; i < 1000; i++) {
    if (started.s.length === 0) {
      break;
    }
    await delay(1);
  }
};

const testRunner = ((name: string, body: () => Promise<void>) => {
  started.s.push(name);
  result.totalEntities++;
  result.tests.push(name);

  const resultBody = body();
  if ((resultBody as any)?.then) {
    resultBody
      .then(k => result.passes.push({ name: name }))
      .catch(err => result.failures.push({ name, message: stripAnsi(err.message) }))
      .finally(() => started.s.pop());
  }
}) as TestRunner;

testRunner.only = testRunner;
testRunner.concurrent = testRunner;

/*testRunner.skip = ((name: string, body: () => Promise<void>) => {
  result.skips.push(stripAnsi(name || 'no reason'));
}) as TestRunner;*/

const pending = (reason?: string) => {
  result.skips.push(stripAnsi(reason || 'no reason'));
};

export const createTest = (desc?: string) =>
  TestEachTesting({
    describe: suiteRunner,
    it: testRunner,
    pending,
  })(desc);
