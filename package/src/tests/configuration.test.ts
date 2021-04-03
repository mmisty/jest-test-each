import { cleanup, createTest, result } from './utils/runner-env';
import { assertAll } from './utils/utils';
import { TestEachSetup } from '../index';

const rootName = 'Test pack - root';
const test = createTest(rootName);

describe('Configuration', () => {
  beforeEach(() => {
    cleanup();
  });

  // check groupping
  // check plain
  const numeric = [
    { isNum: true, exp: '' },
    { isNum: false, exp: '' },
  ];

  numeric.forEach(c => {
    it(`cases should ${c.isNum ? '' : 'not '}be numbered when numericCases in setup is ${
      c.isNum
    }`, async () => {
      TestEachSetup({ groupBySuites: true, numericCases: c.isNum });

      await test()
        .each([{ something: 'a' }, { something: 'ab' }])
        .run(t => {
          expect(t.something).toBe('ab');
        });
      const num = (n: number) => (c.isNum ? `${n}. ` : '');

      assertAll(
        () => expect(result.suites).toEqual([rootName]),
        () => expect(result.tests).toEqual([`${num(1)}something: a`, `${num(2)}something: ab`]),
      );
    });
  });

  numeric.forEach(c => {
    it(`suites should ${c.isNum ? '' : 'not '}be numbered when numericCases in setup is ${
      c.isNum
    }`, async () => {
      TestEachSetup({ groupBySuites: true, numericCases: c.isNum });

      await test()
        .each([{ something: 'a' }, { something: 'ab' }])
        .each([{ foo: 'a' }, { foo: 'ab' }])
        .each([{ last: 'a' }, { last: 'b' }, { last: 'c' }])
        .run(t => {
          expect(1).toBe(1);
        });
      const num = (n: number) => (c.isNum ? `${n}. ` : '');

      assertAll(() =>
        expect(result.suites).toEqual([
          'Test pack - root',
          `${num(1)}something: a`,
          `${num(1)}foo: a`,
          `${num(2)}foo: ab`,
          `${num(2)}something: ab`,
          `${num(1)}foo: a`,
          `${num(2)}foo: ab`,
        ]),
      );
    });
  });

  describe('using configuration for each test', () => {
    const testFunc = (num: boolean) =>
      test()
        .config({ numericCases: num })
        .each([{ something: 'a' }, { something: 'ab' }])
        .run(t => {
          expect(t.something).toBe('ab');
        });

    it('numeric', async () => {
      await testFunc(true);

      assertAll(
        () => expect(result.suites).toEqual([rootName]),
        () =>
          expect(result.tests).toMatchInlineSnapshot(`
              Array [
                "1. something: a",
                "2. something: ab",
              ]
            `),
      );
    });

    it('not numeric', async () => {
      await testFunc(false);

      assertAll(
        () => expect(result.suites).toEqual([rootName]),
        () =>
          expect(result.tests).toMatchInlineSnapshot(`
              Array [
                "something: a",
                "something: ab",
              ]
            `),
      );
    });
  });
});
