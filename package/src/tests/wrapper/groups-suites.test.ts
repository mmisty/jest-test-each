import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

describe('Groups test.Should be suites', () => {
  const rootName = 'Test pack - root';
  const test = () => createTest(rootName);
  const config = { groupBySuites: true, numericCases: false, concurrent: false };

  beforeEach(() => {
    cleanup();
  });

  describe('should be suites - simple', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }, { b: '2' }])
        .run(() => success());

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
              "a: 2",
            ],
            "tests": Array [
              "b: 1",
              "b: 2",
              "b: 1",
              "b: 2",
            ],
            "totalEntities": 7,
          }
        `),
      );
    });
  });

  describe('should be suites - simple - 3x', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '1' }, { c: '2' }, { c: '3' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }, { c: '2' }, { c: '3' }])
        .run(() => success());

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
              Object {
                "name": "c: 3",
              },
              Object {
                "name": "c: 1",
              },
              Object {
                "name": "c: 2",
              },
              Object {
                "name": "c: 3",
              },
              Object {
                "name": "c: 1",
              },
              Object {
                "name": "c: 2",
              },
              Object {
                "name": "c: 3",
              },
              Object {
                "name": "c: 1",
              },
              Object {
                "name": "c: 2",
              },
              Object {
                "name": "c: 3",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
              "b: 1",
              "b: 2",
              "a: 2",
              "b: 1",
              "b: 2",
            ],
            "tests": Array [
              "c: 1",
              "c: 2",
              "c: 3",
              "c: 1",
              "c: 2",
              "c: 3",
              "c: 1",
              "c: 2",
              "c: 3",
              "c: 1",
              "c: 2",
              "c: 3",
            ],
            "totalEntities": 19,
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
      .each([{ c: '1' }, { c: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }, { c: '2' }])
        .run(() => success());

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
              "a: 1",
              "b: 1",
              "b: 2",
            ],
            "tests": Array [
              "c: 1",
              "c: 2",
              "c: 1",
              "c: 2",
            ],
            "totalEntities": 8,
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
      .each([{ d: '1' }, { d: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }, { d: '2' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "d: 1",
              },
              Object {
                "name": "d: 2",
              },
              Object {
                "name": "d: 1",
              },
              Object {
                "name": "d: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
              "c: 1",
              "c: 2",
            ],
            "tests": Array [
              "d: 1",
              "d: 2",
              "d: 1",
              "d: 2",
            ],
            "totalEntities": 8,
          }
        `),
      );
    });
  });

  describe('should be suites - 1 single at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '1' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }])
        .run(() => success());

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
              "a: 2",
            ],
            "tests": Array [
              "b: 1, c: 1",
              "b: 2, c: 1",
              "b: 1, c: 1",
              "b: 2, c: 1",
            ],
            "totalEntities": 7,
          }
        `),
      );
    });
  });

  describe('should be suites - 2 singles at end', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '1' }])
      .each([{ d: '1' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }])
        .each([{ d: '1' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "b: 1, c: 1, d: 1",
              },
              Object {
                "name": "b: 2, c: 1, d: 1",
              },
              Object {
                "name": "b: 1, c: 1, d: 1",
              },
              Object {
                "name": "b: 2, c: 1, d: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
              "a: 2",
            ],
            "tests": Array [
              "b: 1, c: 1, d: 1",
              "b: 2, c: 1, d: 1",
              "b: 1, c: 1, d: 1",
              "b: 2, c: 1, d: 1",
            ],
            "totalEntities": 7,
          }
        `),
      );
    });
  });

  describe('should be suites - singles in center', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ c: '1' }])
      .each([{ d: '1' }, { d: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ c: '1' }])
        .each([{ d: '1' }, { d: '2' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "d: 1",
              },
              Object {
                "name": "d: 2",
              },
              Object {
                "name": "d: 1",
              },
              Object {
                "name": "d: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, c: 1",
              "a: 2, c: 1",
            ],
            "tests": Array [
              "d: 1",
              "d: 2",
              "d: 1",
              "d: 2",
            ],
            "totalEntities": 7,
          }
        `),
      );
    });
  });

  describe('should be suites - several singles in center', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ c: '1' }])
      .each([{ d: '1' }])
      .each([{ e: '1' }, { e: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each([{ c: '1' }])
        .each([{ d: '1' }])
        .each([{ e: '1' }, { e: '2' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "e: 1",
              },
              Object {
                "name": "e: 2",
              },
              Object {
                "name": "e: 1",
              },
              Object {
                "name": "e: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, c: 1, d: 1",
              "a: 2, c: 1, d: 1",
            ],
            "tests": Array [
              "e: 1",
              "e: 2",
              "e: 1",
              "e: 2",
            ],
            "totalEntities": 7,
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
      .each([{ c: '1' }, { c: '2' }])
      .each([{ d: '1' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "c: 1, d: 1",
              },
              Object {
                "name": "c: 2, d: 1",
              },
              Object {
                "name": "c: 1, d: 1",
              },
              Object {
                "name": "c: 2, d: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1",
              "b: 1",
              "b: 2",
            ],
            "tests": Array [
              "c: 1, d: 1",
              "c: 2, d: 1",
              "c: 1, d: 1",
              "c: 2, d: 1",
            ],
            "totalEntities": 8,
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
      .each([{ d: '1' }, { d: '2' }])
      .each([{ e: '1' }])
      .each([{ f: '1' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }, { d: '2' }])
        .each([{ e: '1' }])
        .each([{ f: '1' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "d: 1, e: 1, f: 1",
              },
              Object {
                "name": "d: 2, e: 1, f: 1",
              },
              Object {
                "name": "d: 1, e: 1, f: 1",
              },
              Object {
                "name": "d: 2, e: 1, f: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
              "c: 1",
              "c: 2",
            ],
            "tests": Array [
              "d: 1, e: 1, f: 1",
              "d: 2, e: 1, f: 1",
              "d: 1, e: 1, f: 1",
              "d: 2, e: 1, f: 1",
            ],
            "totalEntities": 8,
          }
        `),
      );
    });
  });

  describe('should be suites - merge suites and tests', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }])
      .each([{ c: '1' }, { c: '2' }])
      .each([{ d: '1' }])
      .each([{ e: '1' }, { e: '2' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }])
        .each([{ c: '1' }, { c: '2' }])
        .each([{ d: '1' }])
        .each([{ e: '1' }, { e: '2' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "e: 1",
              },
              Object {
                "name": "e: 2",
              },
              Object {
                "name": "e: 1",
              },
              Object {
                "name": "e: 2",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: 1, b: 1",
              "c: 1, d: 1",
              "c: 2, d: 1",
            ],
            "tests": Array [
              "e: 1",
              "e: 2",
              "e: 1",
              "e: 2",
            ],
            "totalEntities": 8,
          }
        `),
      );
    });
  });

  describe('should be suites - dependant grouping', () => {
    its()
      .config(config)
      .each([{ a: '1 ' }])
      .each(t => [{ b: '1 a' + t.a }])
      .each(t => [{ c: '1 a' + t.a }, { c: '2 a' + t.a }])
      .each(t => [{ d: '1 a' + t.a }, { d: '2 a' + t.a }])
      .each(t => [{ e: '1 a' + t.a }])
      .each(t => [{ f: '1 d' + t.d }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1 ' }])
        .each(t => [{ b: '1 a' + t.a }])
        .each(t => [{ c: '1 a' + t.a }, { c: '2 a' + t.a }])
        .each(t => [{ d: '1 a' + t.a }, { d: '2 a' + t.a }])
        .each(t => [{ e: '1 a' + t.a }])
        .each(t => [{ f: '1 d' + t.d }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "d: '1 a1 ', e: '1 a1 ', f: '1 d1 a1 '",
              },
              Object {
                "name": "d: '2 a1 ', e: '1 a1 ', f: '1 d2 a1 '",
              },
              Object {
                "name": "d: '1 a1 ', e: '1 a1 ', f: '1 d1 a1 '",
              },
              Object {
                "name": "d: '2 a1 ', e: '1 a1 ', f: '1 d2 a1 '",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a: '1 ', b: '1 a1 '",
              "c: '1 a1 '",
              "c: '2 a1 '",
            ],
            "tests": Array [
              "d: '1 a1 ', e: '1 a1 ', f: '1 d1 a1 '",
              "d: '2 a1 ', e: '1 a1 ', f: '1 d2 a1 '",
              "d: '1 a1 ', e: '1 a1 ', f: '1 d1 a1 '",
              "d: '2 a1 ', e: '1 a1 ', f: '1 d2 a1 '",
            ],
            "totalEntities": 8,
          }
        `),
      );
    });
  });

  describe('should be suites - should merge with previous', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each(t => [{ desc: 'a should be ' + t.a }])
      .each([{ d: '3' }, { d: '4' }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each(t => [{ desc: 'a should be ' + t.a }])
        .each([{ d: '3' }, { d: '4' }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "d: 3",
              },
              Object {
                "name": "d: 4",
              },
              Object {
                "name": "d: 3",
              },
              Object {
                "name": "d: 4",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
              "a should be 1",
              "a should be 2",
            ],
            "tests": Array [
              "d: 3",
              "d: 4",
              "d: 3",
              "d: 4",
            ],
            "totalEntities": 7,
          }
        `),
      );
    });
  });

  describe('should be suites - flatDesc', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each(t => [{ desc: 'a should be ' + t.a }])
      .each([{ d: '3' }, { d: '4' }])
      .each(t => [{ flatDesc: 'some flat desc: a' + t.a + ' d' + t.d }])
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ a: '1' }, { a: '2' }])
        .each(t => [{ desc: 'a should be ' + t.a }])
        .each([{ d: '3' }, { d: '4' }])
        .each(t => [{ flatDesc: 'some flat desc: a' + t.a + ' d' + t.d }])
        .run(() => success());

      await waitFinished();

      expect(result.tests.length).toBeGreaterThan(0);

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "some flat desc: a1 d3",
              },
              Object {
                "name": "some flat desc: a1 d4",
              },
              Object {
                "name": "some flat desc: a2 d3",
              },
              Object {
                "name": "some flat desc: a2 d4",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "some flat desc: a1 d3",
              "some flat desc: a1 d4",
              "some flat desc: a2 d3",
              "some flat desc: a2 d4",
            ],
            "totalEntities": 5,
          }
        `),
      );
    });
  });
});
