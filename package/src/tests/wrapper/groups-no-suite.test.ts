import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

describe('Groups test.Should be no suites', () => {
  const rootName = 'Test pack - root';
  const test = () => createTest(rootName);
  const config = { groupBySuites: true, numericCases: false, concurrent: false };

  beforeEach(() => {
    cleanup();
  });

  describe('should be no suites - all singles', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }])
      .run(t => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
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
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "a: 1, b: 1, c: 1",
            ],
            "totalEntities": 2,
          }
        `),
      );
    });
  });
  describe('should be suites - 1 single at start', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .run(t => success());

    it('wrapper', async () => {
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
                "name": "b: 1",
              },
              Object {
                "name": "b: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
            ],
            "tests": Array [
              "b: 1",
              "b: 2",
            ],
            "totalEntities": 4,
          }
        `),
      );
    });
  });

  describe('should be suites - 2 singles at start', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .run(t => success());

    it('wrapper', async () => {
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
                "name": "c: 1",
              },
              Object {
                "name": "c: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
            ],
            "tests": Array [
              "c: 1",
              "c: 2",
            ],
            "totalEntities": 4,
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

    it('wrapper', async () => {
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

    it('wrapper', async () => {
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

  describe('should be suites - singles at start and at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '1' }])
      .run(t => success());

    it('wrapper', async () => {
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
                "name": "b: 1, c: 1",
              },
              Object {
                "name": "b: 2, c: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
            ],
            "tests": Array [
              "b: 1, c: 1",
              "b: 2, c: 1",
            ],
            "totalEntities": 4,
          }
        `),
      );
    });
  });

  describe('should be suites - several singles at start and at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .each([{ d: '1' }])
      .each([{ e: '1' }])
      .run(t => success());

    it('wrapper', async () => {
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
                "name": "c: 1, d: 1, e: 1",
              },
              Object {
                "name": "c: 2, d: 1, e: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
            ],
            "tests": Array [
              "c: 1, d: 1, e: 1",
              "c: 2, d: 1, e: 1",
            ],
            "totalEntities": 4,
          }
        `),
      );
    });
  });

  describe('should be suites - several singles at start, in center and end', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .each([{ d: '1' }])
      .each([{ e: '1' }])
      .each([{ f: '1' }, { f: '2' }])
      .each([{ g: '1' }])
      .run(t => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }])
        .each([{ e: '1' }])
        .each([{ f: '1' }, { f: '2' }])
        .each([{ g: '1' }])
        .run(t => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "f: 1, g: 1",
              },
              Object {
                "name": "f: 2, g: 1",
              },
              Object {
                "name": "f: 1, g: 1",
              },
              Object {
                "name": "f: 2, g: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
              "c: 1, d: 1, e: 1",
              "c: 2, d: 1, e: 1",
            ],
            "tests": Array [
              "f: 1, g: 1",
              "f: 2, g: 1",
              "f: 1, g: 1",
              "f: 2, g: 1",
            ],
            "totalEntities": 8,
          }
        `),
      );
    });
  });
});
