import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, failure, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test.ensure', () => {
  beforeEach(() => {
    cleanup();
  });
  
  // todo repeat
 // todo: ensure should check specific level + previous levels
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
              "name": "b: 3",
            },
            Object {
              "name": "b: 4",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "a: 1",
          ],
          "tests": Array [
            "Ensure: something",
            "b: 3",
            "b: 4",
          ],
          "totalEntities": 5,
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
              "name": "b: 3",
            },
            Object {
              "name": "b: 4",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "a: 1",
          ],
          "tests": Array [
            "Ensure: something",
            "b: 3",
            "b: 4",
          ],
          "totalEntities": 5,
        }
      `),
    );
  });
});
