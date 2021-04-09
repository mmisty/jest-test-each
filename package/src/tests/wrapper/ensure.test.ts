import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, failure, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test.ensure', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should run additional test when ensure', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '3' }, { b: '4' }])
      .ensure('something', t => {})
      .run((t, b) => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "Ensure: something",
            },
            Object {
              "name": "a: 1, b: 3",
            },
            Object {
              "name": "a: 1, b: 4",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "Ensure: something",
            "a: 1, b: 3",
            "a: 1, b: 4",
          ],
          "totalEntities": 4,
        }
      `),
    );
  });

  it('should fail ensure test', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '3' }, { b: '4' }])
      .ensure('something', t => failure())
      .run((t, b) => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [
            Object {
              "message": "expect(received).toBe(expected) // Object.is equality

        Expected: 0
        Received: 1",
              "name": "Ensure: something",
            },
          ],
          "passes": Array [
            Object {
              "name": "a: 1, b: 3",
            },
            Object {
              "name": "a: 1, b: 4",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "Ensure: something",
            "a: 1, b: 3",
            "a: 1, b: 4",
          ],
          "totalEntities": 4,
        }
      `),
    );
  });
});
