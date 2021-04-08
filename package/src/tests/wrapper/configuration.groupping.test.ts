import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';
import { TestEachSetup } from '../../index';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);

describe('Configuration grouping', () => {
  beforeEach(() => {
    cleanup();
  });

  const testFunc = async (groupBySuites: boolean, setupGlobal: boolean) => {
    const t = () =>
      test()
        .each([{ something: 'a' }, { something: 'ab' }])
        .each([{ darts: 'avv' }, { darts: 'abssd' }]);

    if (setupGlobal) {
      TestEachSetup({ groupBySuites });
      t().run(() => success());
    } else {
      t()
        .config({ groupBySuites })
        .run(() => success());
    }

    await waitFinished();
  };

  const resultGroupped = `
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "darts: avv",
            },
            Object {
              "name": "darts: abssd",
            },
            Object {
              "name": "darts: avv",
            },
            Object {
              "name": "darts: abssd",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "something: a",
            "something: ab",
          ],
          "tests": Array [
            "darts: avv",
            "darts: abssd",
            "darts: avv",
            "darts: abssd",
          ],
          "totalEntities": 7,
        }
      `;

  const resultFlat = `
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "something: a, darts: avv",
            },
            Object {
              "name": "something: a, darts: abssd",
            },
            Object {
              "name": "something: ab, darts: avv",
            },
            Object {
              "name": "something: ab, darts: abssd",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "something: a, darts: avv",
            "something: a, darts: abssd",
            "something: ab, darts: avv",
            "something: ab, darts: abssd",
          ],
          "totalEntities": 5,
        }
      `;

  it('Setup local: group - should be suites', async () => {
    await testFunc(true, false);

    assertAll(() => expect(result).toMatchInlineSnapshot(resultGroupped));
  });

  it('Setup local: not group - should be no suites', async () => {
    await testFunc(false, false);

    assertAll(() => expect(result).toMatchInlineSnapshot(resultFlat));
  });

  it('Setup global: not group - should be no suites', async () => {
    await testFunc(false, true);

    assertAll(() => expect(result).toMatchInlineSnapshot(resultFlat));
  });

  it('Setup global: group - should be suites', async () => {
    await testFunc(true, true);

    assertAll(() => expect(result).toMatchInlineSnapshot(resultGroupped));
  });
});
