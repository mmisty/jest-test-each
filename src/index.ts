// type Combined<T, K> = T & K;

class TestInt<T = {}> {
  eaches: T[] = [];
  desc: string = '';

  constructor(desc: string, private config: TestSetupType) {
    this.desc = desc;
  }

  each<K>(cases: K[]): TestInt<T & K> {
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
    describe(this.desc, () => {
      for (const [i, each] of this.eaches.entries()) {
        const isNum = this.config.numericCases;
        it(`${isNum ? i + ', ' : ''}${JSON.stringify(each)}`, async () => {
          await body(each);
        });
      }
    });
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

export const Test = (desc: string) => new TestInt(desc, testConfig);

type TestSetupType = {
  numericCases: boolean;
};
