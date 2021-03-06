import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, failure, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test.skip', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should skip one case', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '3' }, { b: '4', skip: 'some reason' }])
      .run((t, b) => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "b: 4, skip: 'some reason'",
            },
            Object {
              "name": "b: 3",
            },
          ],
          "skips": Array [
            "Test skipped: 'some reason'",
          ],
          "suites": Array [
            "Test pack - root",
            "a: 1",
          ],
          "tests": Array [
            "b: 3",
            "b: 4, skip: 'some reason'",
          ],
          "totalEntities": 4,
        }
      `),
    );
  });

  it('should skip whole suite', async () => {
    test()
      .config(config)
      .skip('not implemented')
      .each([{ a: '1' }])
      .each([{ b: '3' }, { b: '4' }])
      .run((t, b) => success());

    await waitFinished();

    assertAll(() =>
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
          ],
          "skips": Array [
            "Test skipped: 'not implemented'",
            "Test skipped: 'not implemented'",
          ],
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
