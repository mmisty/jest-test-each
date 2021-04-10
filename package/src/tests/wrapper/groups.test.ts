import { cleanup, createTest, result, waitFinished } from '../utils/runner-env';
import { assertAll, success } from '../utils/utils';

const rootName = 'Test pack - root';
const test = () => createTest(rootName);
const config = { groupBySuites: true, numericCases: false, concurrent: false };

describe('Groups test', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Demo: should be 2 tests and one should fail when test.only', () => {
    describe('Demo0', () => {
      its()
        .config(config)
        .each([{ a: '1' }])
        .each([{ b: '1' }, { b: '2' }])
        .each([{ c: '3' }])
        .run(t => success());
    });
    
    describe('Demo1', () => {
      its()
        .config(config)
        .each([{a: '1'}, {a: '2'}])
        .each([{b: '1'}, {b: '2'}])
        .each([{c: '3'}])
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
  });

  it('Should collapse when has 1 child', async () => {
    test()
      .config(config)
      .each([{ a: '1' }, { a: '2' }])
      .each([{ b: '3' }])
      .run(t => success());

    await waitFinished();

    assertAll(() =>
      expect(result).toMatchInlineSnapshot(`
        Object {
          "failures": Array [],
          "passes": Array [
            Object {
              "name": "a: 1, b: 3",
            },
            Object {
              "name": "a: 2, b: 3",
            },
          ],
          "skips": Array [],
          "suites": Array [
            "Test pack - root",
          ],
          "tests": Array [
            "a: 1, b: 3",
            "a: 2, b: 3",
          ],
          "totalEntities": 3,
        }
      `),
    );
  });
});
