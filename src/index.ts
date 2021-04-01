import { guard } from './utils/utils';

type OneTest<T> = {
  name: string;
  desc: string | ((k: OneTest<T>) => string);
  flatDesc?: string;
  data: T;
};

type Node<T> = {
  name: string;
  children: Node<T>[]; //todo
  data: T | {};
  previousData: T;
  tests: OneTest<T>[];
};

const createNode = <T>(obj: T, parent?: Node<T>): Node<T> => {
  //const objData = typeof obj === 'string' ? {} :obj;
  return {
    name: getName(obj),
    children: [],
    data: obj || {},
    previousData: { ...parent?.previousData, ...obj },
    tests: [],
  };
};

const getName = <T>(obj: T) => {
  const untypedObj = obj as any;
  const desc = untypedObj.desc;
  const flatDesc = untypedObj.flatDesc;
  const combined = () =>
    Object.getOwnPropertyNames(obj)
      .filter(p => p !== 'desc')
      .map(p => {
        if (Array.isArray(untypedObj[p])) {
          return `${p}: [${untypedObj[p]}]`;
        }

        if (typeof untypedObj[p] === 'object') {
          return `${p}: ${JSON.stringify(untypedObj[p])}`;
        }

        return `${p}: ${untypedObj[p]}`;
      })
      .join(', ');

  return flatDesc || (desc ? (typeof desc === 'function' ? desc(obj) : desc) : combined());
};

const runSuite = (suiteRunner: SuiteRunner, callback: () => void, suiteName?: string) => {
  if (suiteName) {
    suiteRunner(suiteName, () => {
      callback();
    });
    return;
  }
  callback();
};

export const tree = <T = {}>(levels: T[][]): Node<T> => {
  const root = createNode({});

  const populateNodes = <K>(node: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const newCases = typeof cases === 'function' ? (cases as any)(node.previousData) : cases;

      if (levelNum === levels.length - 1) {
        // last level

        newCases.forEach((p: T) => {
          node.tests.push({
            name: getName(p),
            desc: (p as any).desc || getName(p),
            data: { ...node.previousData, ...p },
          });
        });
        return;
      } else {
        newCases.forEach((p: any) => {
          const child = createNode(p, node);
          populateNodes(child, levelNum + 1);
          node.children.push(child);
        });
      }
    }
  };

  populateNodes(root);
  return (root as any) as Node<T>;
};

const treeWalk = <T>(
  node: Node<T>,
  onEachNode: ((c: Node<T>, i: number, inside: () => void) => void) | undefined,
  onEachTest: (t: OneTest<T>, i: number) => void,
) => {
  node.children.forEach((c, i) => {
    if (onEachNode) {
      onEachNode(c, i, () => treeWalk(c, onEachNode, onEachTest));
    } else {
      treeWalk(c, onEachNode, onEachTest);
    }
  });
  node.tests.forEach((t, i) => {
    onEachTest(t, i);
  });
};

export type SuiteRunner = (name: string, body: () => void) => void;
export type TestRunner = (name: string, body: () => void) => void;

export type Env = {
  suiteRunner: SuiteRunner;
  testRunner: TestRunner;
};

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
  private config: TestSetupType;

  constructor(desc: string | undefined, private env: Env) {
    this.desc = desc;
    this.config = testConfig;
  }

  // todo: defect addition
  each<TOut>(cases: Input<Combined, TOut>): TestEach<Combined & TOut> {
    this.groups.push(cases as any);
    return this as any;
  }

  run(body: (each: Combined) => void) {
    const isNumberedTestAndSuite = this.config.numericCases;
    const isGroupBySuites = this.config.groupBySuites;
    const root = tree(this.groups);

    const entityName = (num: number, name: string) => {
      return `${isNumberedTestAndSuite ? num + '. ' : ''}${name}`;
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

    return runSuite(this.env.suiteRunner, isGroupBySuites && !isFlat ? run : runFlat, this.desc);
  }
}

const testConfigDefault: TestSetupType = {
  numericCases: true,
  groupBySuites: true,
};

let testConfig: TestSetupType = testConfigDefault;

export const TestEachSetup = (config: Partial<TestSetupType>) => {
  testConfig = { ...testConfigDefault, ...config };
};

//  jest test each  jte

export type TestSetupType = {
  numericCases: boolean;
  groupBySuites: boolean;
};

declare global {
  export const its: (desc?: string) => TestEach;
  export const Test: (desc?: string) => TestEach;
}
const createTest = (desc?: string) => {
  return new TestEach(desc, {
    suiteRunner: describe,
    testRunner: it,
  });
};

(global as any).its = createTest;
(global as any).Test = createTest;
