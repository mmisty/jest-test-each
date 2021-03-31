import { Test } from '../../../src';

describe('simple-suite', () => {
  Test('test')
    .each([{ fruit: 'banana' }, { fruit: 'strawberry' }])
    .each([{ addition: 'milk' }, { addition: 'ice-cream' }])
    .run(async (t) => {
      console.log(`${t.fruit} ${t.addition}`);
      expect(t.fruit).toMatch(/\w*/);
      expect(t.addition).toMatch(/\w*/);
    });
});
