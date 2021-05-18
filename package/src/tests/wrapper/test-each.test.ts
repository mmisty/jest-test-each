import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('Test jest test each', () => {
  beforeEach(() => {
    cleanup();
  });

  // todo add when empty
  // add map to each - additng defect to specific case
  // if all failed = fail only one (setting)

  it('Pass and fail', async () => {
    test()
      .config(config)
      .each([{ something: 'a' }, { something: 'ab' }])
      .run(t => {
        expect(t.something).toBe('ab');
      });

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(3),
      () =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [
              Object {
                "message": "expect(received).toBe(expected) // Object.is equality

          Expected: \\"ab\\"
          Received: \\"a\\"",
                "name": "something: a",
              },
            ],
            "passes": Array [
              Object {
                "name": "something: ab",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "something: a",
              "something: ab",
            ],
            "totalEntities": 3,
          }
        `),
    );
  });

  it('should be one test', async () => {
    test()
      .config(config)
      .each([{ something1: 'a' }])
      .each([{ something2: 'b' }])
      .each([{ something3: 'c' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "something1: a, something2: b, something3: c",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "something1: a, something2: b, something3: c",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('should be no suite when test has no name', async () => {
    createTest()
      .config(config)
      .each([{ something1: 'a' }, { something1: 'b' }])
      .run(t => success());

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(2),
      () => expect(result.failures.length).toBe(0),
      () => expect(result.totalEntities).toBe(2),
      () => expect(result.suites.length).toBe(0),
      () =>
        expect(result.tests).toMatchInlineSnapshot(`
          Array [
            "something1: a",
            "something1: b",
          ]
        `),
    );
  });

  describe('Demo: flat description should run all cases ungroupped', () => {
    its()
      .config(config)
      .each([{ something1: 'a' }, { something1: 'b' }])
      .each([{ brother: 'john' }, { brother: 'george' }])
      .each([{ sister: 'mila' }, { sister: 'rita' }])
      .each(t => [{ flatDesc: t.brother + ' ' + t.something1 + ' ' + t.sister }])
      .run(t => success());
  });

  it('flat description should run all cases ungroupped', async () => {
    createTest()
      .config(config)
      .each([{ something1: 'a' }, { something1: 'b' }])
      .each([{ brother: 'john' }, { brother: 'george' }])
      .each([{ sister: 'mila' }, { sister: 'rita' }])
      .each(t => [{ flatDesc: t.brother + ' ' + t.something1 + ' ' + t.sister }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "john a mila",
            },
            Object {
              "name": "john a rita",
            },
            Object {
              "name": "george a mila",
            },
            Object {
              "name": "george a rita",
            },
            Object {
              "name": "john b mila",
            },
            Object {
              "name": "john b rita",
            },
            Object {
              "name": "george b mila",
            },
            Object {
              "name": "george b rita",
            },
          ],
          "skips": Array [],
          "suites": Array [],
          "tests": Array [
            "john a mila",
            "john a rita",
            "george a mila",
            "george a rita",
            "john b mila",
            "john b rita",
            "george b mila",
            "george b rita",
          ],
          "totalEntities": 8,
        }
      `),
    );
  });

  describe('Demo: flat description(other form) should run all cases ungroupped', () => {
    its()
      .config(config)
      .each([{ something1: 'a' }, { something1: 'b' }])
      .each([{ brother: 'john' }, { brother: 'george' }])
      .each([{ sister: 'mila' }, { sister: 'rita' }])
      .desc(t => t.brother + ' ' + t.something1 + ' ' + t.sister)
      .run(t => success());
  });

  it('flat description should run all cases ungroupped', async () => {
    createTest()
      .config(config)
      .each([{ something1: 'a' }, { something1: 'b' }])
      .each([{ brother: 'john' }, { brother: 'george' }])
      .each([{ sister: 'mila' }, { sister: 'rita' }])
      .desc(t => t.brother + ' ' + t.something1 + ' ' + t.sister)
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "john a mila",
            },
            Object {
              "name": "john a rita",
            },
            Object {
              "name": "george a mila",
            },
            Object {
              "name": "george a rita",
            },
            Object {
              "name": "john b mila",
            },
            Object {
              "name": "john b rita",
            },
            Object {
              "name": "george b mila",
            },
            Object {
              "name": "george b rita",
            },
          ],
          "skips": Array [],
          "suites": Array [],
          "tests": Array [
            "john a mila",
            "john a rita",
            "george a mila",
            "george a rita",
            "john b mila",
            "john b rita",
            "george b mila",
            "george b rita",
          ],
          "totalEntities": 8,
        }
      `),
    );
  });
});
