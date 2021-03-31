// type Combined<T, K> = T & K;

class TestInt<T = {}> {
  eaches: T[] = [];
  desc: string = '';

  constructor(desc: string, input?: TestInt<T>) {
    this.desc = desc;
    if (input?.eaches) {
      this.eaches = input?.eaches;
    }
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
      for (const each of this.eaches) {
        it(`${JSON.stringify(each)}`, async () => {
          await body(each);
        });
      }
    });
  }
}

export const Test = (desc: string) => new TestInt(desc);
