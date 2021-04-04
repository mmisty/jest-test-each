import { TestEach } from '../../test-each';
import { TestEachEnv } from '../../index';
import { Env, Runner, TestRunner } from '../../test-env';
import { delay } from './utils';

const stripAnsi = require('strip-ansi');

const TestEachTesting = (env: Env) => (desc?: string) => {
  TestEachEnv(env);
  return new TestEach(desc);
};

type ResultType = {
  failures: Failure[];
  passes: Pass[];
  totalEntities: number;
  suites: string[];
  tests: string[];
};

export const result: ResultType = {
  failures: [],
  passes: [],
  totalEntities: 0,
  suites: [],
  tests: [],
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
  // console.log('Test started: ' + name);
  started.s.push(name);
  let wasError = false;
  result.totalEntities++;
  result.tests.push(name);
  let isPromise = false;

  try {
    const resultBody = body();
    if ((resultBody as any).then) {
      isPromise = true;
      resultBody
        .then(k => {
          result.passes.push({ name: name });
        })
        .catch(err => {
          result.failures.push({ name, message: stripAnsi(err.message) });
        })
        .finally(() => {
          started.s.pop();
        });
    }
  } catch (err) {
    wasError = true;
    result.failures.push({ name, message: stripAnsi(err.message) });
    // console.log('Test has error:\n===\n' + err + '\n===')
  }
  if (!isPromise) {
    started.s.pop();
  }

  if (!isPromise && !wasError) {
    result.passes.push({ name: name });
    // console.log('Test passed\n===');
  }
}) as TestRunner;

testRunner.only = testRunner;
testRunner.concurrent = testRunner;

const pending = (reason?: string) => {
  // todo
};

const testRunnerEnv: Env = {
  describe: suiteRunner,
  it: testRunner,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
  pending,
};

export const createTest = (desc?: string) => TestEachTesting(testRunnerEnv)(desc);
