import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test.before', () => {
  beforeEach(() => {
    cleanup();
  });
  const befores: { disposed: string[] } = { disposed: [] };

  it('should pass test with .before', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .before(t => {
        befores.disposed.push(t.a);
        return {
          result: t.a,
          dispose: () => befores.disposed.pop(),
        };
      })
      .run((t, b) => {
        expect(b.result).toBe(t.a);
      });

    await waitFinished();

    assertAll(
      () => expect(befores.disposed.length).toBe(0),
      () =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "b: 3",
              },
              Object {
                "name": "b: 4",
              },
              Object {
                "name": "b: 3",
              },
              Object {
                "name": "b: 4",
              },
            ],
            "suites": Array [
              "Test pack - root",
              "a: 1",
              "a: 2",
            ],
            "tests": Array [
              "b: 3",
              "b: 4",
              "b: 3",
              "b: 4",
            ],
            "totalEntities": 7,
          }
        `),
    );
  });

  it('should pass test with several .before', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .before(t => {
        befores.disposed.push(t.a);
        return {
          result1: t.a,
          dispose: () => befores.disposed.pop(),
        };
      })
      .before(t => {
        befores.disposed.push(t.b);
        return {
          result2: t.b,
          dispose: () => befores.disposed.pop(),
        };
      })
      .run((t, b) => {
        expect(b.result1).toBe(t.a);
        expect(b.result2).toBe(t.b);
      });

    await waitFinished();

    assertAll(
      () => expect(befores.disposed.length).toBe(0),
      () =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "b: 3",
              },
              Object {
                "name": "b: 4",
              },
              Object {
                "name": "b: 3",
              },
              Object {
                "name": "b: 4",
              },
            ],
            "suites": Array [
              "Test pack - root",
              "a: 1",
              "a: 2",
            ],
            "tests": Array [
              "b: 3",
              "b: 4",
              "b: 3",
              "b: 4",
            ],
            "totalEntities": 7,
          }
        `),
    );
  });

  it('should fail test when .before throws', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '3' }, { b: '4' }])
      .before(t => {
        throw new Error('Before failed');
      })
      .run((t, b) => success());

    await waitFinished();

    assertAll(
      () => expect(befores.disposed.length).toBe(0),
      () =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [
              Object {
                "message": "Before failed",
                "name": "b: 3",
              },
              Object {
                "message": "Before failed",
                "name": "b: 4",
              },
            ],
            "passes": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
            ],
            "tests": Array [
              "b: 3",
              "b: 4",
            ],
            "totalEntities": 4,
          }
        `),
    );
  });
});
