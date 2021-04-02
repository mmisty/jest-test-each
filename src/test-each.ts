import { guard } from './utils/utils';
import { OneTest, treeWalk, createTree } from './tree';
import { getName } from './utils/name';
import { Env, Runner } from './test-env';
import { testConfig, testConfigDefault, testEnv, TestSetupType } from './test-each-setup';

type WithDesc = { desc?: string };
type WithFlatDesc = { flatDesc?: string };

type InputCaseType<T> = T & WithDesc & WithFlatDesc; // WithDesc => should have field in type for further union

type SimpleCase<T> = InputCaseType<T> | WithComplexDesc<T>;
type FuncCase<T, TOut> = (t: T) => SimpleCase<TOut[]>; // todo

type Input<T, TOut> = SimpleCase<TOut>[] | FuncCase<T, TOut>;

type DescFunc<T> = (k: T) => string;
type WithComplexDesc<T> = { desc?: string | DescFunc<T> } & WithFlatDesc;

export class TestEach<Combined = {}> {
  private groups: Combined[][] = [];
  private desc: string | undefined = '';
  private conf: TestSetupType;
  private env: Env;

  constructor(desc: string | undefined) {
    this.desc = desc;
    this.conf = testConfig.config;

    if (!testEnv.env) {
      throw new Error('Please specify test env (jest/mocha) like: ');
    }

    this.env = testEnv.env;
  }

  config(config: Partial<TestSetupType>): TestEach<Combined> {
    this.conf = { ...testConfigDefault, ...config };
    return this;
  }
  // todo: defect addition
  each<TOut>(cases: Input<Combined, TOut>): TestEach<Combined & TOut> {
    this.groups.push(cases as any);
    return this as any;
  }

  run(body: (each: Combined) => void) {
    if (this.groups.length === 0) {
      guard(!!this.desc, 'Test should have name when no cases');
      this.env.testRunner(this.desc!, () => body({} as any));
      return;
    }

    const { numericCases, groupBySuites } = this.conf;
    const root = createTree(this.groups);

    const entityName = (num: number, name: string) => {
      return `${numericCases ? num + '. ' : ''}${name}`;
    };

    const runCase = <T>(body: (each: T) => void) => (t: OneTest<T>, i: number) => {
      guard(!!t.name, 'Test should have name (empty group of cases)');
      const name = entityName(i + 1, t.name);
      this.env.testRunner(name, () => body(t.data)); // todo;
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

    guard(
      allCases.every(t => t.name),
      'Every case in .each should have not empty data',
    );
    guard(allCases.length !== 0, 'Should be at least one case');

    const run = () =>
      treeWalk(
        root,
        (t, i, inside) => {
          this.env.suiteRunner(entityName(i + 1, t.name), inside);
        },
        runCase(body),
      );

    const runFlat = () => allCases.forEach(runCase(body));

    return runSuite(this.env.suiteRunner, groupBySuites && !isFlat ? run : runFlat, this.desc);
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
