import { guard } from './utils/utils';
const printf = require('printf');

export type casesType<T = {}> = T[];

type OneTest<T> = {
  name: string;
  desc: string | ((k: OneTest<T>) => string);
  data: T;
};

type Node = {
  name: string;
  children: Node[];
  data: any;
  previousData: any;
  tests: OneTest<any>[];
};

const createNode = <T>(obj: T, parent?: Node): Node => {
  //const objData = typeof obj === 'string' ? {} :obj;
  return {
    name: getName(obj),
    children: [],
    data: obj ?? {},
    previousData: { ...parent?.previousData, ...obj },
    tests: [],
  };
};

const getName = <T>(obj: T) => {
  const untypedObj = obj as any;
  const desc = untypedObj.desc;
  const props = Object.getOwnPropertyNames(obj).filter((p) => p !== 'desc');
  const combined = props
    .map((p) => {
      if (Array.isArray(untypedObj[p])) {
        return `${p}:[${untypedObj[p]}]`;
      }

      if (typeof untypedObj[p] === 'object') {
        return `${p}:${JSON.stringify(untypedObj[p])}`;
      }

      return `${p}:${untypedObj[p]}`;
    })
    .join(',');

  if (desc) {
    if (typeof desc === 'function') {
      return desc(obj);
    }
    return printf(desc, untypedObj);
  }
  return combined;
};
/*
const caseName = <T>(each: T): string => {
  if ((each as any).desc) {
    return (each as any).desc;
  }
  const keys = Object.keys(each);
  return keys
    .map((k: string) =>
      typeof (each as any)[k] === 'string'
        ? (each as any)[k]
        : JSON.stringify(each),
    )
    .join(' ');
};*/

const runSuite = (
  suiteRunner: SuiteRunner,
  callback: () => void,
  suiteName?: string,
  
) => {
  if (suiteName) {
    suiteRunner(suiteName, () => {
      callback();
    });
    return;
  }
  callback();
};

export const tree = (levels: any[][]): Node => {
  const root = createNode({});

  const populateNodes = (node: Node, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const newCases =
        typeof cases === 'function' ? (cases as any)(node.previousData) : cases;

      if (levelNum === levels.length - 1) {
        // last level

        newCases.forEach((p: any) => {
          node.tests.push({
            name: getName(p),
            desc: p.desc || getName(p),
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
  return root;
};

const treeWalk = (
  node: Node,
  onEachNode: ((c: Node, i: number, inside: () => void) => void) | undefined,
  onEachTest: (t: OneTest<any>, i: number) => void,
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

type InputCaseType<T> = T & WithDesc; // WithDesc => should have field in type for further union

type SimpleCase<T> = InputCaseType<T> | WithComplexDesc<T>;
type FuncCase<T, TOut> = (t: T) => SimpleCase<TOut[]>; // todo

type Input<T, TOut> = SimpleCase<TOut>[] | FuncCase<T, TOut>;

type DescFunc<T> = (k: T) => string;
type WithComplexDesc<T> = { desc?: string | DescFunc<T> };

//type FullInputCaseType<T, TOut> = Input<T, TOut> | WithComplexDesc<TOut>;

export class TestEach<T = {}> {
  private groups: T[][] = [];
  private desc: string | undefined = '';
  private config: TestSetupType;

  constructor(desc: string | undefined, private env: Env) {
    this.desc = desc;
    this.config = testConfig;
  }
  
  // todo: defect addition
  each<TOut>(cases: Input<T, TOut>): TestEach<T & TOut> {
    this.groups.push(cases as any);
    //cases.forEach(p=>p.desc)
    return this as any;
  }

  run(body: (each: T) => void) {
    const isNumberedTestAndSuite = this.config.numericCases;
    const isGroupBySuites = this.config.groupBySuites;
    const root = tree(this.groups);

    const entityName = (num: number, name: string) => {
      return `${isNumberedTestAndSuite ? num + '. ' : ''}${name}`;
    };

    const runCase = <T>(body: (each: T) => void) => (
      t: OneTest<T>,
      i: number,
    ) => {
      guard(!!t.name, 'Test should have name (empty group of cases)');
      const name = entityName(i + 1, t.name);
      this.env.testRunner(name, () => body(t.data)); // todo;
    };

    const allCases: OneTest<T>[] = [];
    treeWalk(root, undefined, (t) => {
      allCases.push({ ...t, name: getName(t.data) });
    });

    guard(
      allCases.every((t) => t.name),
      'Every case in .each should have not empty data',
    );

    const run = () =>
      treeWalk(
        root,
        (t, i, inside) => {
          this.env.suiteRunner(entityName(i + 1, t.name), inside);
        },
        runCase(body),
      );

    const runFlat = () => allCases.forEach(runCase(body));

    return runSuite(
      this.env.suiteRunner,
      isGroupBySuites ? run : runFlat,
      this.desc,
    );
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

export const Test = (desc?: string) =>
  new TestEach(desc, {
    suiteRunner: describe,
    testRunner: it,
  });

export type TestSetupType = {
  numericCases: boolean;
  groupBySuites: boolean;
};
