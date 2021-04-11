import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Test.only', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('should be 2 tests and one should fail when test.only', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      //.only()
      .run(t => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '3' }, { b: '4' }])
        .only()
        .run(t => success());

      await waitFinished();

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [
              Object {
                "message": "Do not forget to remove .only() from your test before committing",
                "name": "only() should be removed before committing",
              },
            ],
            "passes": Array [
              Object {
                "name": "a: 1, b: 3",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "only() should be removed before committing",
              "a: 1, b: 3",
            ],
            "totalEntities": 3,
          }
        `),
      );
    });
  });

  it('should fail when test.only and case is not found', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .only(t => t.a === '3')
      .run(t => success());

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(0),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(1),
      () => expect(result.suites.length).toBe(0),
      () =>
        expect(result.failures).toMatchInlineSnapshot(`
          Array [
            Object {
              "message": "No such case: t => t.a === '3'",
              "name": "Only one search failed",
            },
          ]
        `),
    );
  });

  it('should pass when test.only and case is found', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }, { a: '3' }])
      .each([{ b: '3' }, { b: '4' }])
      .only(t => t.b === '4' && t.a === '3')
      .run(t => success());

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(3),
      () =>
        expect(result.passes).toMatchInlineSnapshot(`
          Array [
            Object {
              "name": "a: 3, b: 4",
            },
          ]
        `),
    );
  });

  describe.skip('demo: should fail when no cases and test.only', () => {
    its('Demo')
      .config(config)
      //.only()
      .run(t => success());
  });

  it('should fail when no cases and test.only', async () => {
    test()
      .config(config)
      .only()
      .run(t => success());

    await waitFinished();

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.suites.length).toBe(0),
      () => expect(result.totalEntities).toBe(2),
      () =>
        expect(result.passes).toMatchInlineSnapshot(`
          Array [
            Object {
              "name": "Test pack - root",
            },
          ]
        `),
      () =>
        expect(result.failures[0].name).toMatchInlineSnapshot(
          `"only() should be removed before committing"`,
        ),
    );
  });
});
