import { cleanup, createTest, result } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('Test jest test each', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Pass and fail', async () => {
    await test()
      .config(config)
      .each([{ something: 'a' }, { something: 'ab' }])
      .run(t => {
        expect(t.something).toBe('ab');
      });

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(3),
      () => expect(result.failures[0].name).toMatchInlineSnapshot(`"something: a"`),
      () => expect(result.failures[0].message).toContain('Expected: "ab"'),
      () => expect(result.failures[0].message).toContain('Received: "a"'),
      () => expect(result.passes[0].name).toMatchInlineSnapshot(`"something: ab"`),
      () => expect(result.suites).toEqual([rootName]),
      () =>
        expect(result.tests).toMatchInlineSnapshot(`
          Array [
            "something: a",
            "something: ab",
          ]
        `),
    );
  });

  // todo
  it('should be one test', async () => {
    await test()
      .config(config)
      .each([{ something1: 'a' }])
      .each([{ something2: 'b' }])
      .each([{ something3: 'c' }])
      .run(t => success());

    assertAll(
      () => expect(result.passes.length).toBe(1),
      () => expect(result.failures.length).toBe(0),
      () => expect(result.totalEntities).toBe(4),
      () =>
        expect(result.suites).toMatchInlineSnapshot(`
          Array [
            "Test pack - root",
            "something1: a",
            "something2: b",
          ]
        `),
      () =>
        expect(result.tests).toMatchInlineSnapshot(`
          Array [
            "something3: c",
          ]
        `),
      () => expect(result.passes[0].name).toMatchInlineSnapshot(`"something3: c"`),
    );
  });
});
