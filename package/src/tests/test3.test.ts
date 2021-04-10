import { delay, success } from './utils/utils';
import { TestEachSetup } from '../test-each-setup';

describe('test examples', () => {
  describe('Demo1', () => {
    its()
      .each([{ a: '1' }, { a: '3' }])
      .each([{ b: '2', expected: '3' }])
      .defect('SOME_ID', t => t.a === '1')
      .run(t => expect(t.a).toBe(t.expected));
  });
});
