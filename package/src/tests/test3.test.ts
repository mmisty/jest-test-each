import { delay, success } from './utils/utils';
import { TestEachSetup } from '../test-each-setup';

describe('test examples', () => {
  describe('Demo1', () => {
    its()
      .each([{a: '1'}, {a: '2'}])
      .each([{b: '1'}, {b: '2'}])
      .each([{c: '3'}])
      .run(t => success());
  });
});
