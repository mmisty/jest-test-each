import { cleanup, createTest, result } from './utils/runner-env';
import { assertAll, success } from './utils/utils';

const rootName = 'Test pack - root';
const test = createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('Test.only', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should be 2 tests and one should fail when test.only', async () => {
    await test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .only()
      .run(t => success());

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(4),
      () =>
        expect(result.suites).toMatchInlineSnapshot(`
          Array [
            "Test pack - root",
            "a: 1",
          ]
        `),
      () => expect(result.passes[0].name).toMatchInlineSnapshot(`"b: 3"`),
      () =>
        expect(result.failures[0].name).toMatchInlineSnapshot(
          `"only() should be removed before committing"`,
        ),
    );
  });

  it('should fail when test.only and case is not found', async () => {
    await test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .only(t => t.a === '3')
      .run(t => success());

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
    await test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }, { b: '4' }])
      .only(t => t.b === '4')
      .run(t => success());

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(4),
      () =>
        expect(result.passes).toMatchInlineSnapshot(`
          Array [
            Object {
              "name": "b: 4",
            },
          ]
        `),
    );
  });
});
