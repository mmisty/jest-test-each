// type Combined<T, K> = T & K;

export type casesType<T = {}> = T[];

type OneTest<T> = {
  name: string;
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

const getName = <T>(obj: string | T) => {
  if (typeof obj === 'string') {
    return obj;
  }
  const props = Object.getOwnPropertyNames(obj);
  return props.map((p) => `${p}:${(obj as any)[p]}`).join(',');
};
export const tree = (levels: any[][]): Node => {
  const root = createNode({});

  const populateNodes = (node: Node, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      if (levelNum === levels.length - 1) {
        // last level
        cases.forEach((p) => {
          node.tests.push({
            name: getName(p),
            data: { ...node.previousData, ...p },
          });
        });
        return;
      } else {
        cases.forEach((p) => {
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

class TestInt<T = {}> {
  eaches: T[] = [];
  groups: T[][] = [];
  desc: string | undefined = '';

  constructor(desc: string | undefined, private config: TestSetupType) {
    this.desc = desc;
  }

  // todo: ability to use t=> [] or []
  // todo: case formatting name sprintf
  // todo: group by suites
  each<K>(cases: K[]): TestInt<T & K> {
    this.groups.push(cases as any);
    /* if (this.eaches.length > 0) {
      let newM: (T & K)[] = [];
      this.eaches.forEach((x) => {
        cases.forEach((k) => newM.push({ ...x, ...k }));
      });
      this.eaches = newM;
      return this as any;
    }
    this.eaches.push(...(cases as (T & K)[]));*/
    return this as any;
  }

  run(body: (each: T) => void) {
    const root = tree(this.groups);

    const run = (node: Node) => {
      node.children.forEach((c) => {
        describe(c.name, () => {
          run(c);
        });
      });
      node.tests.forEach((t) => {
        it(t.name, async () => {
          await body(t.data); // todo;
        });
      });
    };
    run(root);

    /*const runSuite = () => {
      for (const [i, each] of this.eaches.entries()) {
        const isNum = this.config.numericCases;

        const caseName = (each: T): string => {
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
        };
        it(`${isNum ? i + 1 + ', ' : ''}${caseName(each)}`, async () => {
          await body(each);
        });
      }
    };
    if (this.desc) {
      describe(this.desc, () => {
        runSuite();
      });
    } else {
      runSuite();
    }*/
  }
}

const testConfigDefault: TestSetupType = {
  numericCases: true,
};

let testConfig = testConfigDefault;

export const TestEach = {
  setup: (config: TestSetupType) => {
    testConfig = { ...testConfigDefault, ...config };
  },
};

export const Test = (desc?: string) => new TestInt(desc, testConfig);

type TestSetupType = {
  numericCases: boolean;
};
