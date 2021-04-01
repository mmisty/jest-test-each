import { cleanup, result, TestEachTesting, testRunnerEnv } from '../runner-env';
import { assertAll } from '../../../src/utils/utils';
import { TestEach } from '../../../src';

const test = TestEachTesting(testRunnerEnv)('Test pack');

describe('Test jest test each', () => {
  beforeEach(() => {
    cleanup();
  });

  it('test1', async () => {
    TestEach.setup({ groupBySuites: true, numericCases: true });
    test.each([{ something: 'a' }]).run((t) => {
      expect(t.something).toBe('ab');
    });

    assertAll(
      () => expect(result.passes).toEqual([]),
      () => expect(result.failures.length).toBe(1),
      () => expect(result.totalEntities).toBe(2),
      () => expect(result.suites).toEqual(['Test pack']),
      () => expect(result.tests).toEqual(['1. something:a']),
    );

    assertAll(
      () => expect(result.failures[0].name).toBe('1. something:a'),
      () => expect(result.failures[0].message).toMatch('Expected: "ab"'),
      () => expect(result.failures[0].message).toContain('Received: "a"'),
    );
  });
});
