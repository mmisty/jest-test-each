import { Env, SuiteRunner, TestInt, TestRunner } from '../../src';

const stripAnsi = require('strip-ansi');

export const TestEachTesting = (env: Env) => (desc?: string) =>
  new TestInt(desc, env);

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

const suiteRunner: SuiteRunner = (name: string, body: () => void) => {
  console.log('Suite started: ' + name);
  result.totalEntities++;
  result.suites.push(name);
  body();
};

const testRunner: TestRunner = async (name: string, body: () => void) => {
  console.log('Test started: ' + name);
  let wasError = false;
  result.totalEntities++;
  result.tests.push(name);
  try {
    await body();
  } catch (err) {
    wasError = true;
    result.failures.push({ name, message: stripAnsi(err.message) });
    console.log('Test has error:\n===\n' + err + '\n===');
  }

  if (!wasError) {
    result.passes.push({ name });
  }
};

export const testRunnerEnv: Env = {
  suiteRunner,
  testRunner,
};
