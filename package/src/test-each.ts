import { guard } from './utils/utils';
import { OneTest, treeWalk, createTree } from './tree';
import { getName } from './utils/name';
import { Env, Runner, TestRunner } from './test-env';
import {
  testConfig,
  testConfigDefault,
  testEnvDefault,
  TestSetupType,
  userEnv,
} from './test-each-setup';

type WithDesc = { desc?: string };
type WithFlatDesc = { flatDesc?: string };
type WithDefect = { defect?: string };

type InputCaseType<T> = T & (WithDesc | WithComplexDesc<T>) & WithFlatDesc & WithDefect; // WithDesc => should have field in type for further union
type Disposable = { dispose?: () => void };
type SimpleCase<T> = InputCaseType<T>;
type FuncCase<T, TOut> = (t: T) => SimpleCase<TOut[]>; // todo desc as func doesn't work for cases as func
type Input<T, TOut> = SimpleCase<TOut>[] | FuncCase<T, TOut>;

type DescFunc<T> = (k: T) => string;
type WithComplexDesc<T> = { desc?: string | DescFunc<T> };
type OnlyInput<T> = (t: T) => boolean;

type Before<T> = T & Disposable;
type BeforeInput<T, TOut> = (t: T) => Before<TOut>;

export class TestEach<Combined = {}, BeforeT = {}> {
  private groups: Combined[][] = [];
  private befores: BeforeInput<Combined, BeforeT>[] = [];
  private desc: string | undefined = '';
  private conf: TestSetupType;
  private env: Env;
  private defectTest: string | undefined = undefined;
  private onlyOne: boolean = false;
  private concurrentTests: boolean = false;
  private onlyOneFilter: OnlyInput<Combined> | undefined = undefined;

  constructor(desc: string | undefined) {
    this.desc = desc;
    this.conf = testConfig.config;

    this.env = userEnv.env ?? testEnvDefault().env;

    if (!this.env) {
      throw new Error('Please specify test env (jest/mocha) like');
    }
  }

  only(input?: OnlyInput<Combined>): TestEach<Combined, BeforeT> {
    this.onlyOne = true;
    if (input) {
      this.onlyOneFilter = input;
    }
    return this;
  }

  config(config: Partial<TestSetupType>): TestEach<Combined, BeforeT> {
    this.conf = { ...testConfigDefault, ...config };
    return this;
  }

  // todo proper
  concurrent(): TestEach<Combined, BeforeT> {
    this.concurrentTests = true;
    return this;
  }

  defect(reason: string): TestEach<Combined, BeforeT> {
    this.defectTest = reason;
    return this;
  }

  before<TOut>(before: BeforeInput<Combined, TOut>): TestEach<Combined, BeforeT & TOut> {
    this.befores.push(before as any);
    return this as any;
  }

  // todo: defect addition
  each<TOut>(cases: Input<Combined, TOut>): TestEach<Combined & TOut, BeforeT> {
    this.groups.push(cases as any);
    return this as any;
  }

  private runTest(
    testRunner: TestRunner,
    name: string,
    body: (t: Combined, b: BeforeT) => void,
    args?: Combined,
    isBefore?: boolean,
  ) {
    const markedDefect = (args as SimpleCase<Combined>)?.defect || this.defectTest;
    const defectTestName = markedDefect ? ` - Marked with defect '${markedDefect}'` : '';
    const testName = markedDefect
      ? name.replace(/(, )?defect\:.*(,|$)/, '') + defectTestName
      : name;

    return testRunner(testName, async () => {
      if (markedDefect) {
        // if it passes -> fail
        // if it fails -> skip
        try {
          await this.runBody(body, args, isBefore);
        } catch (e) {
          this.env.pending(
            `Test marked with defect '${markedDefect}': Actual fail reason:\n ${e.message}`,
          );
          return;
        }

        throw new Error(`Test doesn't fail but marked with defect`);
      }

      await this.runBody(body, args, isBefore);
    });
  }

  private async runBody(
    body: (t: Combined, b: BeforeT) => void,
    args?: Combined,
    isBefore?: boolean,
  ) {
    const beforeResults: Disposable[] = [];
    let beforeResult: any = {};
    if (isBefore && this.befores.length > 0) {
      for (const b of this.befores) {
        const res = await b(args || ({} as any));
        beforeResults.push(res);
        beforeResult = { ...beforeResult, ...res };
      }
    }

    try {
      await body(args || ({} as any), beforeResult);
    } finally {
      // after each
      beforeResults.forEach(p => (p.dispose ? p.dispose() : {}));
    }
  }

  private entityName = (num: number, name: string) => {
    return `${this.conf.numericCases ? num + '. ' : ''}${name}`;
  };

  private runCase(testRunner: TestRunner, body: (each: Combined, b: BeforeT) => void) {
    return (t: OneTest<Combined>, i: number) => {
      guard(!!t.name, 'Every case in .each should have not empty data');
      const name = this.entityName(i + 1, t.name);
      this.runTest(testRunner, name, body, t.data, true);
    };
  }

  private testIfOnly = (testRunner: TestRunner) => {
    if (this.onlyOne) {
      this.runTest(testRunner, 'only() should be removed before committing', () => {
        throw new Error('Do not forget to remove .only() from your test before committing');
      });
    }
  };

  run(body: (each: Combined, before: BeforeT) => void) {
    const { groupBySuites, maxTestNameLength } = this.conf;
    const useConcurrency = this.concurrentTests || this.conf.concurrent;

    const testRunner = this.onlyOne
      ? this.env.it.only
      : useConcurrency
      ? this.env.it.concurrent
      : this.env.it;
    let allCases: OneTest<Combined>[] = [];

    const root = createTree(this.groups, maxTestNameLength);

    treeWalk(root, undefined, t => {
      allCases.push({
        ...t,
        name: getName(t.data, maxTestNameLength),
        flatDesc: (t.data as SimpleCase<Combined>).flatDesc,
      });
    });
    const isFlat = allCases.every(p => p.flatDesc);

    if (this.onlyOne) {
      const casesFound = allCases.filter(k =>
        this.onlyOneFilter ? this.onlyOneFilter(k.data) : true,
      );

      if (this.onlyOneFilter && casesFound.length === 0) {
        this.runTest(testRunner, 'Only one search failed', () => {
          throw new Error('No such case: ' + this.onlyOneFilter!.toString());
        });

        return;
      }
      allCases = [casesFound[0]];
    }

    if (this.groups.length === 0 && !!this.desc) {
      // should not group into suite when only one case
      this.runTest(testRunner, this.desc!, body, undefined, true);
      this.testIfOnly(testRunner);
      return;
    }

    const suiteGuards = () => {
      guard(!(this.groups.length === 0 && !this.desc), 'Test should have name when no cases');
    };

    const tests = () =>
      treeWalk(
        root,
        (t, i, inside) => {
          this.env.describe(this.entityName(i + 1, t.name), inside);
        },
        this.runCase(testRunner, body),
      );

    const testsFlat = () => allCases.forEach(this.runCase(testRunner, body));

    runSuite(
      this.env.describe,
      () => {
        suiteGuards();
        this.testIfOnly(testRunner);
        groupBySuites && !isFlat && !this.onlyOne ? tests() : testsFlat();
      },
      this.desc,
    );
  }
}

const runSuite = (suiteRunner: Runner, callback: () => void, suiteName?: string) => {
  if (suiteName) {
    suiteRunner(suiteName, () => {
      callback();
    });
    return;
  }
  callback();
};
