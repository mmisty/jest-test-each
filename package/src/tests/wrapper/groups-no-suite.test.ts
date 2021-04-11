import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

describe('Groups test.Should be no suites', () => {
  const rootName = 'Test pack - root';
  const test = () => createTest(rootName);
  const config = { groupBySuites: true, numericCases: false, concurrent: false };

  beforeEach(() => {
    cleanup();
  });

  describe('should be no suites - 1 single at start', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .run(t => success());

    it('wrapper - should be no suites - 1 single at start', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }, { b: '2' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
                  Object {
                    "failures": Array [],
                    "passes": Array [
                      Object {
                        "name": "a: 1, b: 1",
                      },
                      Object {
                        "name": "a: 1, b: 2",
                      },
                    ],
                    "skips": Array [],
                    "suites": Array [
                      "Test pack - root",
                    ],
                    "tests": Array [
                      "a: 1, b: 1",
                      "a: 1, b: 2",
                    ],
                    "totalEntities": 3,
                  }
              `),
      );
    });
  });

  describe('should be no suites - 2 singles at start', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .run(t => success());

    it('wrapper - should be no suites - 2 singles at start', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
                  Object {
                    "failures": Array [],
                    "passes": Array [
                      Object {
                        "name": "a: 1, b: 1, c: 1",
                      },
                      Object {
                        "name": "a: 1, b: 1, c: 2",
                      },
                    ],
                    "skips": Array [],
                    "suites": Array [
                      "Test pack - root",
                    ],
                    "tests": Array [
                      "a: 1, b: 1, c: 1",
                      "a: 1, b: 1, c: 2",
                    ],
                    "totalEntities": 3,
                  }
              `),
      );
    });
  });

  describe('should be no suites - 1 single at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }])
      .run(t => success());

    it('wrapper - should be no suites - 1 single at end', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
                  Object {
                    "failures": Array [],
                    "passes": Array [
                      Object {
                        "name": "a: 1, b: 1",
                      },
                      Object {
                        "name": "a: 2, b: 1",
                      },
                    ],
                    "skips": Array [],
                    "suites": Array [
                      "Test pack - root",
                    ],
                    "tests": Array [
                      "a: 1, b: 1",
                      "a: 2, b: 1",
                    ],
                    "totalEntities": 3,
                  }
              `),
      );
    });
  });

  describe('should be no suites - 2 singles at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }])
      .run(t => success());

    it('wrapper - should be no suites - 2 singles at end', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
                  Object {
                    "failures": Array [],
                    "passes": Array [
                      Object {
                        "name": "a: 1, b: 1, c: 1",
                      },
                      Object {
                        "name": "a: 2, b: 1, c: 1",
                      },
                    ],
                    "skips": Array [],
                    "suites": Array [
                      "Test pack - root",
                    ],
                    "tests": Array [
                      "a: 1, b: 1, c: 1",
                      "a: 2, b: 1, c: 1",
                    ],
                    "totalEntities": 3,
                  }
              `),
      );
    });
  });

  describe('should be no suites - singles at start and at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '1' }])
      .run(t => success());

    it('wrapper - should be no suites - singles at start and at end', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
                  Object {
                    "failures": Array [],
                    "passes": Array [
                      Object {
                        "name": "a: 1, b: 1, c: 1",
                      },
                      Object {
                        "name": "a: 1, b: 2, c: 1",
                      },
                    ],
                    "skips": Array [],
                    "suites": Array [
                      "Test pack - root",
                    ],
                    "tests": Array [
                      "a: 1, b: 1, c: 1",
                      "a: 1, b: 2, c: 1",
                    ],
                    "totalEntities": 3,
                  }
              `),
      );
    });
  });

  describe('should be no suites - several singles at start and at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .each([{ d: '1' }])
      .each([{ e: '1' }])
      .run(t => success());

    it('wrapper - should be no suites - singles at start and at end', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }])
        .each([{ e: '1' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "a: 1, b: 1, c: 1, d: 1, e: 1",
              },
              Object {
                "name": "a: 1, b: 1, c: 2, d: 1, e: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "a: 1, b: 1, c: 1, d: 1, e: 1",
              "a: 1, b: 1, c: 2, d: 1, e: 1",
            ],
            "totalEntities": 3,
          }
        `),
      );
    });
  });
});
