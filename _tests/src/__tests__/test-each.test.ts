import { cleanup, result, TestEachTesting, testRunnerEnv } from '../runner-env';
import { assertAll } from '../../../src/utils/utils';
import { TestEachSetup } from '../../../src';

const rootName = 'Test pack - root';
const test = () => TestEachTesting(testRunnerEnv)(rootName);

describe('Test jest test each', () => {
  beforeEach(() => {
    cleanup();
  });

  // check groupping
  // check plain
  describe('Configuration: isNumeric', () => {
    const numeric = [
      { isNum: true, exp: '' },
      { isNum: false, exp: '' },
    ];

    numeric.forEach((c) => {
      it(`cases should ${
        c.isNum ? '' : 'not '
      }be numbered when numericCases in setup is ${c.isNum}`, async () => {
        TestEachSetup({ groupBySuites: true, numericCases: c.isNum });

        await test()
          .each([{ something: 'a' }, { something: 'ab' }])
          .run((t) => {
            expect(t.something).toBe('ab');
          });
        const num = (n: number) => (c.isNum ? `${n}. ` : '');
        assertAll(
          () => expect(result.suites).toEqual([rootName]),
          () =>
            expect(result.tests).toEqual([
              `${num(1)}something: a`,
              `${num(2)}something: ab`,
            ]),
        );
      });

      it(`suites should ${
        c.isNum ? '' : 'not '
      }be numbered when numericCases in setup is ${c.isNum}`, async () => {
        TestEachSetup({ groupBySuites: true, numericCases: c.isNum });

        await test()
          .each([{ something: 'a' }, { something: 'ab' }])
          .each([{ foo: 'a' }, { foo: 'ab' }])
          .each([{ last: 'a' }, { last: 'b' }, { last: 'c' }])
          .run((t) => {
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
  });

  it('Pass and fail', async () => {
    TestEachSetup({ groupBySuites: true, numericCases: false });

    await test()
      .each([{ something: 'a' }, { something: 'ab' }])
      .run((t) => {
        expect(t.something).toBe('ab');
      });

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(3),
      () => expect(result.failures[0].name).toBe('something: a'),
      () => expect(result.failures[0].message).toMatch('Expected: "ab"'),
      () => expect(result.failures[0].message).toContain('Received: "a"'),
      () => expect(result.passes[0].name).toBe('something: ab'),
      () => expect(result.suites).toEqual([rootName]),
      () => expect(result.tests).toEqual(['something: a', 'something: ab']),
    );
  });

  it('test2', async () => {
    TestEachSetup({ groupBySuites: true, numericCases: true });

    await test()
      .each([{ something1: 'a' }])
      .each([{ something2: 'b' }])
      .each([{ something3: 'c' }])
      .run((t) => {
        expect(t.something1).toBe('a');
        expect(t.something2).toBe('b');
        expect(t.something3).toBe('c');
      });

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(0),
      () => expect(result.totalEntities).toBe(4),
      () =>
        expect(result.suites).toEqual([
          rootName,
          '1. something1: a',
          '1. something2: b',
        ]),
      () => expect(result.tests).toEqual(['1. something3: c']),
      () => expect(result.passes[0].name).toBe('1. something3: c'),
    );
  });

  it('should throw', async () => {
    TestEachSetup({ groupBySuites: true, numericCases: true });

    await test()
      .each([{ something1: 'a' }])
      .each([{ something2: 'b' }])
      .each([{ something3: 'c' }])
      .run((t) => {
        expect(t.something1).toBe('a');
        expect(t.something2).toBe('b');
        expect(t.something3).toBe('c');
      });

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(0),
      () => expect(result.totalEntities).toBe(4),
      () =>
        expect(result.suites).toEqual([
          rootName,
          '1. something1: a',
          '1. something2: b',
        ]),
      () => expect(result.tests).toEqual(['1. something3: c']),
      () => expect(result.passes[0].name).toBe('1. something3: c'),
    );
  });
});
