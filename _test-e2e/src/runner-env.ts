import { TestEach } from 'jest-test-each/dist/test-each';
import { Env, Runner } from 'jest-test-each/dist/test-env';
import { TestEachEnv } from 'jest-test-each';

const stripAnsi = require('strip-ansi');

export const TestEachTesting = (env: Env) => (desc?: string) => {
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

// todo think
export const cleanup = () => {
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

const testRunner: Runner = async (name: string, body: () => void) => {
  // console.log('Test started: ' + name);
  let wasError = false;
  result.totalEntities++;
  result.tests.push(name);
  try {
    await body();
  } catch (err) {
    wasError = true;
    result.failures.push({ name, message: stripAnsi(err.message) });
    // console.log('Test has error:\n===\n' + err + '\n===');
  }

  if (!wasError) {
    result.passes.push({ name: name });
    // console.log('Test passed\n===');
  }
};

export const testRunnerEnv: Env = {
  suiteRunner,
  testRunner,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
};
