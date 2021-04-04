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
      expName: 'simple: [el: 1, el: 2, el: 3]',
    },
    {
      desc: 'more complex array',
      case: { simple: [{ el: { inside: 5 } }, { el: { inside: 11 } }, { el: 3 }] },
      expName: 'simple: [el: {inside: 5}, el: {inside: 11}, el: 3]',
    },

    {
      desc: 'function inside',
      case: { simple: [{ el: { inside: 5 } }, { el: { inside: () => {} } }, { el: 3 }] },
      expFail: true,
      error: `Too complex obj in test - please specify 'desc' for the case`,
      expName: undefined,
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
      error: `Too complex obj in test - please specify 'desc' for the case`,
      expName: undefined,
    },
    {
      desc: 'long name - err',
      case: {
        simple: [
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 5 } },
          { el: { inside: 11 } },
          { el: 3 },
        ],
      },
      expFail: true,
      error: `Case name is too long (>100 symbols), please specify 'desc'`,
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
        ],
      },
      expName: 'long name',
    },
  ];

  data.forEach(p => {
    it(p.desc, async () => {
      let err1: Error | undefined = undefined;
      try {
        test()
          .config(config)
          .each([p.case as any])
          .run(t => success());

        await waitFinished();
      } catch (err) {
        err1 = err;
      }

      assertAll(
        !p.expFail
          ? () => expect(result.tests[0]).toBe(p.expName)
          : () => expect(err1?.message).toBe(p.error),
      );
    });
  });

  it('case length configuration', async () => {
    let err1: Error | undefined = undefined;
    try {
      test()
        .config({ maxTestNameLength: 10 })
        .each([{ a: 'supersupersuper' }])
        .run(t => success());

      await waitFinished();
    } catch (err) {
      err1 = err;
    }

    assertAll(() =>
      expect(err1?.message).toBe("Case name is too long (>10 symbols), please specify 'desc'"),
    );
  });
});
