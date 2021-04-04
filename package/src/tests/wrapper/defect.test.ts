import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test with defect', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should fail test when defected test passed', async () => {
    test()
      .config(config)
      .each([{ a: '1', expected: '1', defect: 'some' }])
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [
            Object {
              "message": "Test doesn't fail but marked with defect",
              "name": "a: 1, expected: 1 - Marked with defect 'some'",
            },
          ],
          "passes": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, expected: 1 - Marked with defect 'some'",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('should skip test when defected test fails', async () => {
    test()
      .config(config)
      .each([{ a: '1', expected: '0', defect: 'some' }])
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "a: 1, expected: 0 - Marked with defect 'some'",
            },
          ],
          "skips": Array [
            "Test marked with defect 'some': Actual fail reason:
         expect(received).toBe(expected) // Object.is equality

        Expected: \\"0\\"
        Received: \\"1\\"",
          ],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, expected: 0 - Marked with defect 'some'",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });
});
