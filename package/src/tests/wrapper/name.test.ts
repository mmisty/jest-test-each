import { assertAll, success } from '../utils/utils';
import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false };

describe('naming', () => {
  beforeEach(() => {
    cleanup();
  });

  const data = [
    { desc: 'simple string', case: { simple: '1' }, expName: 'simple: 1' },
    { desc: 'simple num', case: { simple: 1 }, expName: 'simple: 1' },
    { desc: '2 props', case: { simple: 1, simple2: 'f' }, expName: 'simple: 1, simple2: f' },
    { desc: 'simple array', case: { simple: [1, 2, 3] }, expName: 'simple: [1, 2, 3]' },
    {
      desc: 'complex array',
      case: { simple: [{ el: 1 }, { el: 2 }, { el: 3 }] },
      expName: 'simple: [{ el: 1 }, { el: 2 }, { el: 3 }]',
    },
    {
      desc: 'more complex array',
      case: { simple: [{ el: { inside: 5 } }, { el: { inside: 11 } }, { el: 3 }] },
      expName: 'simple: [{ el: { inside: 5 } }, { el: { inside: 11 } }, { el: 3 }]',
    },

    {
      desc: 'function inside',
      case: { simple: [{ el: { inside: 5 } }, { el: { inside: () => {} } }, { el: 3 }] },
      expFail: true,
      error: `From guard: Test case data has functions in it. Please add 'desc' to case.`,
    },
    {
      desc: 'function inside with desc',
      case: {
        desc: 'test desc',
        simple: [{ el: { inside: 5 } }, { el: { inside: () => {} } }, { el: 3 }],
      },

      expName: 'test desc',
    },
    {
      desc: 'func simple',
      case: { func: () => {} },
      expFail: true,
      error: `From guard: Test case data has functions in it. Please add 'desc' to case.`,
    },
    {
      desc: 'long name - default err',
      case: {
        simple: [
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
        ],
      },
      expFail: true,
      error: `From guard: Automatic test name is too long (>200symbols). Please add 'desc' to case.`,
    },
    {
      desc: 'long name with desc',
      case: {
        desc: 'long name',
        simple: [
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
        ],
      },
      expName: 'long name',
    },
    {
      desc: 'string containing not only letters',
      case: { simple: 'some description!!' },
      expName: "simple: 'some description!!'",
    },
    {
      desc: 'string containing only letters/numbers',
      case: { simple: 'some3424' },
      expName: 'simple: some3424',
    },
    {
      desc: 'string containing quotes',
      case: { simple: `some "quotes": to be defined` },
      expName: "simple: 'some \\'quotes\\': to be defined'",
    },
    {
      desc: 'undefined obj',
      case: { simple: undefined },
      expName: 'simple: undefined',
    },
    {
      desc: 'undefined obj with null',
      case: { simple: undefined, someString: 'null should be ...' },
      expName: `simple: null, someString: 'null should be ...'`,
    },
    {
      desc: 'undefined complex obj',
      case: { simple: { some: undefined, some2: 'dsdsd' } },
      expName: 'simple: { some: undefined, some2: dsdsd }',
    },
    {
      desc: 'array with undefined complex obj',
      case: {
        googles: {
          some34: [{ a: undefined }, { b: 'ok' }],
          some2: 'dsdsd',
          some4: 'wor1 word3 sas',
          some3: 'word',
        },
        arr: [1, 2, 3],
      },
      expName: `googles: { some34: [{ a: undefined }, { b: ok }], some2: dsdsd, some4: 'wor1 word3 sas', some3: word }, arr: [1, 2, 3]`,
    },
  ];

  data.forEach(p => {
    it(p.desc, async () => {
      test()
        .config(config)
        .each([p.case as any])
        .run(t => success());

      await waitFinished();

      assertAll(
        !p.expFail
          ? () => expect(result.tests[0]).toBe(p.expName)
          : () => expect(result.failures[0].message).toBe(p.error),
      );
    });
  });

  it('functions with desc in next each', async () => {
    test()
      .each([
        {
          a: () => {
            return 1;
          },
        },
      ])
      .each([{ desc: 'description' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "description",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "description",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('functions with flatDesc in next each', async () => {
    test()
      .each([
        {
          a: () => {
            return 1;
          },
        },
      ])
      .each([{ flatDesc: 'sdsd' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "sdsd",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "sdsd",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('case length configuration', async () => {
    test()
      .config({ testSuiteName: { maxLength: 10, failOnReached: true } })
      .each([{ a: 'supersupersuper' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result.failures).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "From guard: Automatic test name is too long (>10symbols). Please add 'desc' to case.",
            "name": "a: supersu...",
          },
        ]
      `),
    );
  });

  it('case length configuration - suite', async () => {
    test()
      .config({ testSuiteName: { maxLength: 50, failOnReached: true } })
      .each([
        {
          a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 15, 16, 11, 17].map(p => ({
            aa: p,
          })),
        },
      ])
      .each(t => t.a)
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "aa: 1",
            },
            Object {
              "name": "aa: 2",
            },
            Object {
              "name": "aa: 3",
            },
            Object {
              "name": "aa: 4",
            },
            Object {
              "name": "aa: 5",
            },
            Object {
              "name": "aa: 6",
            },
            Object {
              "name": "aa: 7",
            },
            Object {
              "name": "aa: 8",
            },
            Object {
              "name": "aa: 9",
            },
            Object {
              "name": "aa: 10",
            },
            Object {
              "name": "aa: 11",
            },
            Object {
              "name": "aa: 12",
            },
            Object {
              "name": "aa: 12",
            },
            Object {
              "name": "aa: 13",
            },
            Object {
              "name": "aa: 14",
            },
            Object {
              "name": "aa: 15",
            },
            Object {
              "name": "aa: 16",
            },
            Object {
              "name": "aa: 11",
            },
            Object {
              "name": "aa: 17",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "a: [{ aa: 1 }, { aa: 2 }, { aa: 3 }, { aa: 4 }, { ...",
          ],
          "tests": Array [
            "aa: 1",
            "aa: 2",
            "aa: 3",
            "aa: 4",
            "aa: 5",
            "aa: 6",
            "aa: 7",
            "aa: 8",
            "aa: 9",
            "aa: 10",
            "aa: 11",
            "aa: 12",
            "aa: 12",
            "aa: 13",
            "aa: 14",
            "aa: 15",
            "aa: 16",
            "aa: 11",
            "aa: 17",
          ],
          "totalEntities": 21,
        }
      `),
    );
  });

  it('case length configuration - not fail', async () => {
    test()
      .config({ testSuiteName: { maxLength: 10, failOnReached: false } })
      .each([{ a: 'supersupersuper' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "a: supersu...",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: supersu...",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });
});
