import { guard } from './utils/utils';
import { OneTest, treeWalk, createTree } from './tree';
import { getName } from './utils/name';
import { Env, Runner } from './test-env';
import {
  testConfig,
  testConfigDefault,
  testEnvDefault,
  TestSetupType,
  userEnv,
} from './test-each-setup';

type WithDesc = { desc?: string };
type WithFlatDesc = { flatDesc?: string };

type InputCaseType<T> = T & WithDesc & WithFlatDesc; // WithDesc => should have field in type for further union

type SimpleCase<T> = InputCaseType<T> | WithComplexDesc<T>;
type FuncCase<T, TOut> = (t: T) => SimpleCase<TOut[]>; // todo

type Input<T, TOut> = SimpleCase<TOut>[] | FuncCase<T, TOut>;

type DescFunc<T> = (k: T) => string;
type WithComplexDesc<T> = { desc?: string | DescFunc<T> } & WithFlatDesc;
type OnlyInput<T> = (t: T) => boolean;

export class TestEach<Combined = {}> {
  private groups: Combined[][] = [];
  private desc: string | undefined = '';
  private conf: TestSetupType;
  private env: Env;
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

  only(input?: OnlyInput<Combined>): TestEach<Combined> {
    this.onlyOne = true;
    if (input) {
      this.onlyOneFilter = input;
    }
    return this;
  }

  config(config: Partial<TestSetupType>): TestEach<Combined> {
    this.conf = { ...testConfigDefault, ...config };
    return this;
  }

  // todo proper
  concurrent(): TestEach<Combined> {
    this.concurrentTests = true;
    return this;
  }

  // todo: defect addition
  each<TOut>(cases: Input<Combined, TOut>): TestEach<Combined & TOut> {
    this.groups.push(cases as any);
    return this as any;
  }

  run(body: (each: Combined) => void) {
    const useConcurrency = this.concurrentTests || this.conf.concurrent;

    const testRunner = this.onlyOne
      ? this.env.it.only
      : useConcurrency
      ? this.env.it.concurrent
      : this.env.it;

    if (this.onlyOne) {
      // todo cleanup
      const notFound = this.groups.every(p => p.filter(k => this.onlyOneFilter?.(k)).length === 0);

      if (this.onlyOneFilter && notFound) {
        testRunner('Only one search failed', () => {
          throw new Error('No such case: ' + this.onlyOneFilter!.toString());
        });
        return;
      }

      this.groups = this.onlyOneFilter
        ? this.groups.map((p, i) => {
            const filtered = p.filter(k => this.onlyOneFilter?.(k));
            return [filtered.length === 0 ? p[0] : filtered[0]];
          })
        : this.groups.map(p => [p[0]]);
    }

    const testIfOnly = () => {
      if (this.onlyOne) {
        testRunner('only() should be removed before committing', () => {
          guard(!this.onlyOne, 'Do not forget to remove .only() from your test before committing');
        });
      }
    };

    if (this.groups.length === 0 && !!this.desc) {
      // should not group into suite when only one case
      testRunner(this.desc!, () => body({} as any));
      testIfOnly();
      return;
    }

    const { numericCases, groupBySuites } = this.conf;
    const root = createTree(this.groups);

    const entityName = (num: number, name: string) => {
      return `${numericCases ? num + '. ' : ''}${name}`;
    };

    const allCases: OneTest<Combined>[] = [];

    treeWalk(root, undefined, t => {
      allCases.push({
        ...t,
        name: getName(t.data),
        flatDesc: (t.data as SimpleCase<Combined>).flatDesc,
      });
    });
    const isFlat = allCases.every(p => p.flatDesc);

    const suiteGuards = () => {
      guard(!(this.groups.length === 0 && !this.desc), 'Test should have name when no cases');
    };

    const runCase = <T>(body: (each: T) => void) => (t: OneTest<T>, i: number) => {
      guard(!!t.name, 'Every case in .each should have not empty data');
      const name = entityName(i + 1, t.name);
      testRunner(name, () => body(t.data)); // todo;
    };

    const tests = () =>
      treeWalk(
        root,
        (t, i, inside) => {
          this.env.describe(entityName(i + 1, t.name), inside);
        },
        runCase(body),
      );

    const testsFlat = () => allCases.forEach(runCase(body));

    runSuite(
      this.env.describe,
      () => {
        suiteGuards();
        testIfOnly();
        groupBySuites && !isFlat ? tests() : testsFlat();
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
