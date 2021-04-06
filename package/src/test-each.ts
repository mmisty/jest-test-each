import { guard } from './utils/utils';
import { OneTest, treeWalk, createTree } from './tree';
import { CODE_RENAME, CodeRename, getName } from './utils/name';
import { Env, Runner, TestRunner } from './test-env';
import {
  testConfig,
  testConfigDefault,
  testEnvDefault,
  TestSetupType,
  userEnv,
} from './test-each-setup';
import JestMatchers = jest.JestMatchers;

const stripAnsi = require('strip-ansi');

type WithDesc = { desc?: string };
type WithFlatDesc = { flatDesc?: string };
type WithDefect = { defect?: string; actualFailReasonParts?: string[] };
type WithSkip = { skip?: string };

type InputCaseType<T> = T & (WithDesc | WithComplexDesc<T>) & WithFlatDesc & WithDefect & WithSkip;
type Disposable = { dispose?: () => void };
type SimpleCase<T> = InputCaseType<T>;
type FuncCase<T, TOut> = (t: T) => SimpleCase<TOut[]>; // todo desc as func doesn't work for cases as func
type FuncOneCase<T, TOut> = (t: T) => SimpleCase<TOut>;
type Input<T, TOut> = SimpleCase<TOut>[] | FuncCase<T, TOut>;

type DescFunc<T> = (k: T) => string;
type WithComplexDesc<T> = { desc?: string | DescFunc<T> };
type OnlyInput<T> = (t: T) => boolean;

type Before<T> = T & Disposable;
type BeforeOut<T> = Promise<Before<T>> | Before<T>;
type BeforeInput<T, TOut> = (t: T) => BeforeOut<TOut> | void;
type Defect<T> = { reason: string; filter: OnlyInput<T> | undefined };
export class TestEach<Combined = {}, BeforeT = {}> {
  private additions: SimpleCase<{}>[] = [];
  private groups: Combined[][] = [];
  private befores: BeforeInput<Combined, BeforeT>[] = [];
  private ensures: { desc: string; check: (t: Combined[]) => void }[] = [];
  private ensuresCasesLength: ((t: JestMatchers<number>) => void)[] = [];
  private conf: TestSetupType;

  private defects: Defect<Combined>[] = [];
  // private defectTestFilter: OnlyInput<Combined> | undefined = undefined;

  private skippedTest: string | undefined = undefined;
  private onlyOne: boolean = false;
  private concurrentTests: boolean = false;
  private onlyOneFilter: OnlyInput<Combined> | undefined = undefined;

  private readonly desc: string | undefined = '';
  private readonly env: Env;

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

  ensure(desc: string, cases: (t: Combined[]) => void): TestEach<Combined, BeforeT> {
    this.ensures.push({ desc, check: cases });
    return this;
  }

  ensureCasesLength(exp: (t: JestMatchers<number>) => void): TestEach<Combined, BeforeT> {
    this.ensuresCasesLength.push(exp);
    return this;
  }

  defect(reason: string, input?: OnlyInput<Combined>): TestEach<Combined, BeforeT> {
    this.defects.push({ reason: reason, filter: input });
    return this;
  }

  skip(reason: string): TestEach<Combined, BeforeT> {
    this.skippedTest = reason;
    return this;
  }

  before<TOut>(before: BeforeInput<Combined, TOut>): TestEach<Combined, BeforeT & TOut> {
    this.befores.push(before as any);
    return this as any;
  }

  /**
   * Will add specified object to each test case
   */
  add<TOut>(input: SimpleCase<TOut>): TestEach<Combined & TOut, BeforeT> {
    this.additions.push(input as any);
    return this as any;
  }

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
    const skipped = (args as SimpleCase<Combined>)?.skip || this.skippedTest;
    const markedDefect = (args as SimpleCase<Combined>)?.defect;
    const defectTestName = markedDefect ? ` - Marked with defect` : '';
    const testName = markedDefect ? name + defectTestName : name;
    //? name.replace(/(, )?defect\:\s*('|"|`)[^'"`]*('|"|`)/, '') + defectTestName

    const reasons = (args as SimpleCase<Combined>)?.actualFailReasonParts;

    return testRunner(testName, async () => {
      if (skipped) {
        this.env.pending(`Test skipped: '${skipped}'`);
        return;
      }

      if (markedDefect) {
        // if it passes -> fail
        // if it fails -> skip
        try {
          await this.runBody(body, args, isBefore);
        } catch (err) {
          const alignedMessage = stripAnsi(err.message);
          const markPending = () => {
            this.env.pending(
              `Test marked with defect '${markedDefect}': Actual fail reason:\\n ${alignedMessage}`,
            );
          };
          // check reasons
          if (reasons) {
            if (reasons.every(r => alignedMessage.includes(r))) {
              markPending();
              return;
            }

            throw new Error(
              `Actual fail reason doesn't contain [${reasons}]\nActual fail reason:\n "${alignedMessage}"`,
            );
          }
          markPending();
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
    const beforeResults: BeforeOut<any> = [];
    let beforeResult: any = {};
    if (isBefore && this.befores.length > 0) {
      for (const b of this.befores) {
        const res = await b(args || ({} as any));
        if (res instanceof Object) {
          beforeResults.push(res);
          beforeResult = { ...beforeResult, ...(res as BeforeOut<any>) };
        }
      }
    }

    try {
      await body(args || ({} as any), beforeResult);
    } finally {
      // after each
      beforeResults.forEach((p: any) => (p.dispose ? p.dispose() : {}));
    }
  }

  private entityName = (num: number, name: string) => {
    return `${this.conf.numericCases ? num + '. ' : ''}${name}`;
  };

  private runCase(testRunner: TestRunner, body: (each: Combined, b: BeforeT) => void) {
    return (t: OneTest<Combined>, i: number) => {
      guard(!!t.name, 'Every case in .each should have not empty data');

      const name = this.entityName(i + 1, t.name);
      this.runTest(
        testRunner,
        name,
        async (args, b) => {
          guard(!t.failCode, messageFromRenameCode(t.failCode, this.conf.maxTestNameLength));
          await body(args, b);
        },
        t.data,
        true,
      );
    };
  }

  private testIfOnly = (testRunner: TestRunner) => {
    if (this.onlyOne) {
      this.runTest(testRunner, 'only() should be removed before committing', () => {
        throw new Error('Do not forget to remove .only() from your test before committing');
      });
    }
  };

  private addDefect = (data: Combined, defect: Defect<Combined>): any => {
    const foundDefected = () => {
      if (defect && defect.filter) {
        const res = defect.filter(data);
        return res === undefined ? false : res;
      }
      return false;
    };

    const isDefect = !defect.filter || foundDefected();
    return isDefect ? { defect: defect.reason } : {};
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

    let additions = {};
    this.additions.forEach(p => (additions = { ...additions, ...p }));

    const root = createTree(this.groups, additions, maxTestNameLength, undefined, k => {
      let defect = {};
      const defectObjs = this.defects.map(defect =>
        this.addDefect({ ...k.data, ...additions }, defect),
      );
      defectObjs.forEach(p => (defect = { ...defect, ...p }));
      const name = getName({ ...additions, ...defect }, maxTestNameLength);
      const name2 = getName({ ...k.data, ...additions, ...defect }, maxTestNameLength);
      const newName = k.name + (name.name ? ', ' + name.name : '');
      const case_ = {
        ...k,
        data: { ...k.data, ...additions, ...defect },
        name: newName,
        failCode: name2.code,
      };
      allCases.push({ ...case_, flatDesc: (case_.data as SimpleCase<Combined>).flatDesc });
      return case_;
    });
    
    // run test showing that filter is incorrect
    if (this.defects.length > 0) {
      this.defects.forEach((defect, i) => {
        const casesFound = allCases.filter(k => (defect.filter ? defect.filter(k.data) : true));

        if (defect.filter && casesFound.length === 0) {
          this.runTest(testRunner, 'Filtering defect returned no results ' + (i + 1), () => {
            throw new Error('No such case: ' + defect.filter!.toString());
          });

          return;
        }
      });
    }

    const runEnsures = () => {
      if (this.ensures.length > 0) {
        this.ensures.forEach(ensure => {
          this.runTest(testRunner, 'Ensure: ' + ensure.desc, () => {
            ensure.check(allCases.map(p => p.data));
          });
        });
      }

      if (this.ensuresCasesLength.length > 0) {
        this.ensuresCasesLength.forEach(ensure => {
          this.runTest(testRunner, 'Ensure cases length', () => {
            ensure(expect(allCases.map(p => p.data).length));
          });
        });
      }
    };

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
        if (!this.onlyOne) {
          runEnsures();
        }
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

const messageFromRenameCode = (code: CodeRename, maxLength: number) => {
  switch (code) {
    case CODE_RENAME.nameTooLong: {
      return `Automatic test name is too long (>${maxLength}symbols). Please add 'desc' to case.`;
    }
    case CODE_RENAME.nameHasFunctions: {
      return `Test case data has functions in it. Please add 'desc' to case.`;
    }
    default:
      return 'unknown code';
  }
};
