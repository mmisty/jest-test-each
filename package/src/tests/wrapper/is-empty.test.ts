import { assertAll, success } from '../utils/utils';
import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';

describe('Should fail when not isEmpty and empty cases', () => {
  const rootName = 'Test pack - root';
  const test = () => createTest(rootName);
  const config = { groupBySuites: true, numericCases: false, concurrent: false };

  beforeEach(() => {
    cleanup();
  });

  describe('Simple', () => {
    it('wrapper', async () => {
      const r = () =>
        createTest()
          .config(config)
          .each([])
          .run(() => success());

      assertAll(() =>
        expect(r).toThrow(new Error('From guard: Test should have at least one test')),
      );
    });
  });

  describe('Simple - isEmpty true - should fail on suite guard', () => {
    it('wrapper', async () => {
      const r = () =>
        createTest()
          .config(config)
          .each([{ isEmpty: true }])
          .each([])
          .run(() => success());

      assertAll(() =>
        expect(r).toThrow(new Error('From guard: Test should have at least one test')),
      );
    });
  });

  describe('Simple - is empty and other cases - should not fail', () => {
    its()
      .config(config)
      .each([
        {
          cases: [{ a: 1 }],
        },
        { cases: [], isEmpty: true },
      ])
      .each(t => t.cases)
      .run(() => success());

    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ cases: [{ a: 1 }] }, { cases: [], isEmpty: true }])
        .each(t => t.cases)
        .run(() => success());

      await waitFinished();

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [],
            "passes": Array [
              Object {
                "name": "cases: [{ a: 1 }], a: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "cases: [{ a: 1 }], a: 1",
            ],
            "totalEntities": 2,
          }
        `),
      );
    });
  });

  describe('Simple - is empty false and other cases - should fail', () => {
   /* its('test')
      .config(config)
      .each([{ addition: 'abc' }])
      .each([{ cases: [{ a: 1 }] }, { cases: [] }])
      .each(t => t.cases)
      .run(() => success());*/
    
    it('wrapper', async () => {
      test()
        .config(config)
        .each([{ addition: 'abc' }])
        .each([{ cases: [{ a: 1 }] }, { cases: [] }])
        .each(t => t.cases)
        .run(() => success());

      await waitFinished();

      assertAll(() =>
        expect(result).toMatchInlineSnapshot(`
          Object {
            "failures": Array [
              Object {
                "message": "every .each should have non empty cases.
          If it is expected mark cases with \\"isEmpty:true\\"

          each 't => t.cases' evaluated to an empty array.
          	Args {{\\"addition\\":\\"abc\\",\\"cases\\":[]}}",
                "name": "t => t.cases",
              },
            ],
            "passes": Array [
              Object {
                "name": "addition: abc, cases: [{ a: 1 }], a: 1",
              },
            ],
            "skips": Array [],
            "suites": Array [
              "Test pack - root",
            ],
            "tests": Array [
              "t => t.cases",
              "addition: abc, cases: [{ a: 1 }], a: 1",
            ],
            "totalEntities": 3,
          }
        `),
      );
    });
  });
});
