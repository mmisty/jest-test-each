import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Groups test', () => {
  beforeEach(() => {
    cleanup();
  });

  its('Demo: No merging')
    .config(config)
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '1' }, { b: '2' }])
    .each([{ c: '1' }, { c: '2' }])
    .run(t => success());

  it('No merging2', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
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
            "a: 2",
            "b: 1",
            "b: 2",
          ],
          "tests": Array [
            "c: 1",
            "c: 2",
            "c: 1",
            "c: 2",
            "c: 1",
            "c: 2",
            "c: 1",
            "c: 2",
          ],
          "totalEntities": 15,
        }
      `),
    );
  });

  describe('Demo0', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ d: '3' }, { d: '4' }])
      .run(t => success());
  });

  describe('Demo1', () => {
    its()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '3' }])
      .run(t => success());
  });

  its('Demo2')
    .config(config)
    .each([{ y: '0' }])
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '1' }, { b: '2' }])
    .each([{ c: '3' }])
    .run(t => success());

  its('Demo3')
    .config(config)
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '1' }, { b: '2' }])
    .each([{ c: '3' }])
    .each([{ d: '3' }, { d: '5' }])
    .run(t => success());

  its('Demo4')
    .config(config)
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '3' }])
    .run(t => success());

  its('Demo5')
    .config(config)
    .each([{ a: '1' }])
    .each([{ b: '1' }, { b: '2' }])
    .each([{ c: '3' }])
    .each([{ d: '3' }, { d: '4' }])
    .run(t => success());

  it('Should be merged suites and merged tests ', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '3' }])
      .each([{ d: '3' }, { d: '4' }])
      .run(t => success());

    await waitFinished();

    expect(result.tests.length).toBeGreaterThan(0);

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "c: 3, d: 3",
            },
            Object {
              "name": "c: 3, d: 4",
            },
            Object {
              "name": "c: 3, d: 3",
            },
            Object {
              "name": "c: 3, d: 4",
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
            "c: 3, d: 3",
            "c: 3, d: 4",
            "c: 3, d: 3",
            "c: 3, d: 4",
          ],
          "totalEntities": 8,
        }
      `),
    );
  });

  its('Demo6')
    .config(config)
    .each([{ a: '1' }])
    .each([{ b: '1' }, { b: '2' }])
    .each([{ c: '3' }])
    .each([{ d: '4' }])
    .each([{ e: '3' }, { e: '4' }])
    .run(t => success());

  it('Should be merged suites and merged tests - 2 singles inside', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each([{ b: '1' }, { b: '2' }])
      .each([{ c: '3' }])
      .each([{ d: '4' }])
      .each([{ e: '3' }, { e: '4' }])
      .run(t => success());

    await waitFinished();

    expect(result.tests.length).toBeGreaterThan(0);

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "c: 3, d: 4, e: 3",
            },
            Object {
              "name": "c: 3, d: 4, e: 4",
            },
            Object {
              "name": "c: 3, d: 4, e: 3",
            },
            Object {
              "name": "c: 3, d: 4, e: 4",
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
            "c: 3, d: 4, e: 3",
            "c: 3, d: 4, e: 4",
            "c: 3, d: 4, e: 3",
            "c: 3, d: 4, e: 4",
          ],
          "totalEntities": 8,
        }
      `),
    );
  });

  describe('Demo7', () => {
    its()
      .config(config)
      .each([{ a: '1' }])
      .each(t => [{ b: 'a1' + t.a }, { b: 'a2' + t.a }])
      .each(t => [{ c: 'b' + t.b }])
      .each(t => [{ d: 'c' + t.c }])
      .each(t => [{ e: 'd1' + t.d }, { e: 'd2' + t.d }])
      .run(t => success());
  });

  it('Should be merged suites and merged tests - dependant groups', async () => {
    test()
      .config(config)
      .each([{ a: '1' }])
      .each(t => [{ b: 'a1' + t.a }, { b: 'a2' + t.a }])
      .each(t => [{ c: 'b' + t.b }])
      .each(t => [{ d: 'c' + t.c }])
      .each(t => [{ e: 'd1' + t.d }, { e: 'd2' + t.d }])
      .run(t => success());

    await waitFinished();

    expect(result.tests.length).toBeGreaterThan(0);

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "c: ba11, d: cba11, e: d1cba11",
            },
            Object {
              "name": "c: ba11, d: cba11, e: d2cba11",
            },
            Object {
              "name": "c: ba21, d: cba21, e: d1cba21",
            },
            Object {
              "name": "c: ba21, d: cba21, e: d2cba21",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "a: 1",
            "b: a11",
            "b: a21",
          ],
          "tests": Array [
            "c: ba11, d: cba11, e: d1cba11",
            "c: ba11, d: cba11, e: d2cba11",
            "c: ba21, d: cba21, e: d1cba21",
            "c: ba21, d: cba21, e: d2cba21",
          ],
          "totalEntities": 8,
        }
      `),
    );
  });
});
