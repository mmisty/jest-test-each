import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, delay } from '../utils/utils';

describe('Async tests', () => {
  const rootName = 'Test pack - root';
  const test = () => createTest(rootName);
  const config = { groupBySuites: true, numericCases: false };

  beforeEach(() => {
    cleanup();
  });

  it('Async test passes', async () => {
    test()
      .config(config)
      .each([{ something: 'ab c' }, { something: 'ab d' }])
      .run(async t => {
        await delay(10);
        expect(t.something).toContain('ab');
      });

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "something: 'ab c'",
            },
            Object {
              "name": "something: 'ab d'",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "something: 'ab c'",
            "something: 'ab d'",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });

  it('Async test fails', async () => {
    test()
      .config(config)
      .each([{ something: 'ab c' }, { something: 'ab d' }])
      .run(async t => {
        await delay(10);
        expect(t.something).not.toContain('ab');
      });

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [
            Object {
              "message": "expect(received).not.toContain(expected) // indexOf

        Expected substring: not \\"ab\\"
        Received string:        \\"ab c\\"",
              "name": "something: 'ab c'",
            },
            Object {
              "message": "expect(received).not.toContain(expected) // indexOf

        Expected substring: not \\"ab\\"
        Received string:        \\"ab d\\"",
              "name": "something: 'ab d'",
            },
          ],
          "passes": Array [],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "something: 'ab c'",
            "something: 'ab d'",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });
});
