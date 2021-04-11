import { delay, success } from './utils/utils';
import { TestEachSetup } from '../test-each-setup';

describe('test examples', () => {
  describe('Demo0', () => {
    its()
      .each([{ a: '1' },{ a: '2' }])
      .each(t=> [{ desc: 'a should be ' + t.a }])
      .each([{ d: '3' }, { d: '4' }])
      .run(t => success());
  });
});
