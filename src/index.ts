// type Combined<T, K> = T & K;

class TestInt<T = {}> {
  eaches: T[] = [];
  groups: T[] = [];
  desc: string|undefined = '';

  constructor(desc: string|undefined, private config: TestSetupType) {
    this.desc = desc;
  }

  // todo: ability to use t=> [] or []
  // todo: case formatting name sprintf
  // todo: group by suites
  each<K>(cases: K[]): TestInt<T & K> {
    this.groups.push(cases as any);
    if (this.eaches.length > 0) {
      let newM: (T & K)[] = [];
      this.eaches.forEach((x) => {
        cases.forEach((k) => newM.push({ ...x, ...k }));
      });
      this.eaches = newM;
      return this as any;
    }
    this.eaches.push(...(cases as (T & K)[]));
    return this as any;
  }

  run(body: (each: T) => void) {
    const runSuite = () => {
      for (const [i, each] of this.eaches.entries()) {
        const isNum = this.config.numericCases;
    
        const caseName = (each: T): string => {
          if((each as any).desc){
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
        it(`${isNum ? (i+1)+ ', ' : ''}${caseName(each)}`, async () => {
          await body(each);
        });
      }
    }
    if(this.desc){
      describe(this.desc, () => {
        runSuite();
      });
    }
    else{
      runSuite();
    }
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
