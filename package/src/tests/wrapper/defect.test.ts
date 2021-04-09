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
              "name": "a: 1, expected: 1, defect: some - Marked with defect 'some'",
            },
          ],
          "passes": Array [],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, expected: 1, defect: some - Marked with defect 'some'",
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
              "name": "a: 1, expected: 0, defect: some - Marked with defect 'some'",
            },
          ],
          "skips": Array [
            "Test marked with defect 'some': Actual fail reason:\\\\n expect(received).toBe(expected) // Object.is equality

        Expected: \\"0\\"
        Received: \\"1\\"",
          ],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, expected: 0, defect: some - Marked with defect 'some'",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('should skip test with defect filtered', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '1')
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "a: 1, b: 2, expected: 3, defect: SOME_ID - Marked with defect 'SOME_ID'",
            },
            Object {
              "name": "a: 3, b: 2, expected: 3",
            },
          ],
          "skips": Array [
            "Test marked with defect 'SOME_ID': Actual fail reason:\\\\n expect(received).toBe(expected) // Object.is equality

        Expected: \\"3\\"
        Received: \\"1\\"",
          ],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, b: 2, expected: 3, defect: SOME_ID - Marked with defect 'SOME_ID'",
            "a: 3, b: 2, expected: 3",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });

  xdescribe('Demo: should fail when not found defect', () => {
    its('DEMO')
      .config(config)
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '4')
      .run(t => expect(t.a).toBe(t.expected));
  });

  it('should fail when not found defect', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '4')
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [
            Object {
              "message": "No such case: t => t.a === '4'",
              "name": "Filtering defect returned no results 1",
            },
            Object {
              "message": "expect(received).toBe(expected) // Object.is equality

        Expected: \\"3\\"
        Received: \\"1\\"",
              "name": "a: 1, b: 2, expected: 3",
            },
          ],
          "passes": Array [
            Object {
              "name": "a: 3, b: 2, expected: 3",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "Filtering defect returned no results 1",
            "a: 1, b: 2, expected: 3",
            "a: 3, b: 2, expected: 3",
          ],
          "totalEntities": 4,
        }
      `),
    );
  });

  it('should skip test with defect filtered and reason', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '1', ['Expected: "3"', 'Received: "1"'])
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "a: 1, b: 2, expected: 3, defect: SOME_ID, actualFailReasonParts: ['Expected: \\\\'3\\\\'', 'Received: \\\\'1\\\\''] - Marked with defect 'SOME_ID'",
            },
            Object {
              "name": "a: 3, b: 2, expected: 3",
            },
          ],
          "skips": Array [
            "Test marked with defect 'SOME_ID': Actual fail reason:\\\\n expect(received).toBe(expected) // Object.is equality

        Expected: \\"3\\"
        Received: \\"1\\"",
          ],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, b: 2, expected: 3, defect: SOME_ID, actualFailReasonParts: ['Expected: \\\\'3\\\\'', 'Received: \\\\'1\\\\''] - Marked with defect 'SOME_ID'",
            "a: 3, b: 2, expected: 3",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });

  it('should skip test with defect filtered and fails with other reason', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '1', ['Expected: "5"', 'Received: "1"'])
      .run(t => expect(t.a).toBe(t.expected));

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [
            Object {
              "message": "Actual fail reason doesn't contain [Expected: \\"5\\",Received: \\"1\\"]
        Actual fail reason:
         \\"expect(received).toBe(expected) // Object.is equality

        Expected: \\"3\\"
        Received: \\"1\\"\\"",
              "name": "a: 1, b: 2, expected: 3, defect: SOME_ID, actualFailReasonParts: ['Expected: \\\\'5\\\\'', 'Received: \\\\'1\\\\''] - Marked with defect 'SOME_ID'",
            },
          ],
          "passes": Array [
            Object {
              "name": "a: 3, b: 2, expected: 3",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, b: 2, expected: 3, defect: SOME_ID, actualFailReasonParts: ['Expected: \\\\'5\\\\'', 'Received: \\\\'1\\\\''] - Marked with defect 'SOME_ID'",
            "a: 3, b: 2, expected: 3",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });
});
