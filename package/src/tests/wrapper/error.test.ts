import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('Error handling', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should throw when no name and cases', async () => {
    const r = () =>
      createTest()
        .config(config)
        .run(t => success());

    assertAll(() =>
      expect(r).toThrow(new Error('From guard: Test should have name when no cases')),
    );
  });

  it('should NOT throw when name and no cases', async () => {
    test()
      .config(config)
      .run(t => success());

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(0),
      () => expect(result.suites.length).toBe(0),
      () => expect(result.totalEntities).toBe(1),
    );
  });

  it('should throw when no data in some eaches', async () => {
    const empty = () =>
      test()
        .config(config)
        .each([{}])
        .run(t => success());

    const notTotallyEmpty = () =>
      test()
        .config(config)
        .each([{ a: 6 }, { a: 7 }])
        .each([{}])
        .run(t => success());

    assertAll(
      () =>
        expect(empty).toThrow(
          new Error('From guard: Every case in .each should have not empty data'),
        ),
      () =>
        expect(notTotallyEmpty).toThrow(
          new Error('From guard: Every case in .each should have not empty data'),
        ),
    );
  });
});
