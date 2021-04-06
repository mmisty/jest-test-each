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
              "name": "1. description",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
            "1. a: function",
          ],
          "tests": Array [
            "1. description",
          ],
          "totalEntities": 3,
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
              "name": "1. sdsd",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "1. sdsd",
          ],
          "totalEntities": 2,
        }
      `),
    );
  });

  it('case length configuration', async () => {
    test()
      .config({ maxTestNameLength: 10 })
      .each([{ a: 'supersupersuper' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result.failures).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "From guard: Automatic test name is too long (>10symbols). Please add 'desc' to case.",
            "name": "1. a: supersupersuper",
          },
        ]
      `),
    );
  });
});
