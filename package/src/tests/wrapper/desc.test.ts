import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('Test jest test each', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Should have dependent desc', () => {
    its()
      .config(config)
      .each([
        { something: 'a', desc: (k: any) => k.something },
        { something: 'ab', desc: (k: any) => k.something },
      ])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([
          { something: 'a', desc: (k: any) => k.something },
          { something: 'ab', desc: (k: any) => k.something },
        ])
        .run(() => success());

      await waitFinished();

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "a",
              },
              Object {
                "name": "ab",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "a",
              "ab",
            ],
            "totalEntities": 3,
          }
        `),
      );
    });
  });

  describe('Should merge descriptions from each level', () => {
    its()
      .config(config)
      .each([
        { something: 'a', desc: 'aa' },
        { something: 'ab', desc: 'bb' },
      ])
      .each([{ test: '1', desc: 'test' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([
          { something: 'a', desc: 'aa' },
          { something: 'ab', desc: 'bb' },
        ])
        .each([{ test: '1', desc: 'test' }])
        .run(() => success());

      await waitFinished();

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "aa test",
              },
              Object {
                "name": "bb test",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "aa test",
              "bb test",
            ],
            "totalEntities": 3,
          }
        `),
      );
    });
  });
});
