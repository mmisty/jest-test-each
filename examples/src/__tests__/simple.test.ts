import { Test } from '../../../src';

describe('simple-suite', () => {
  Test('test')
    .each([{ fruit: 'banana' }, { fruit: 'strawberry' }])
    .each([{ addition: 'milk' }, { addition: 'ice-cream' }])
    .each([{ special: 'spicies' }])
    .run(async (t) => {
      console.log(`${t.fruit} ${t.addition} ${t.special}`);
      expect(t.fruit).toMatch(/\w*/);
      expect(t.addition).toMatch(/\w*/);
    });

  /*
   * banana
   * --milk
   * --ice cream
   * strawberry
   * --milk
   * --icecream
   *
   *
   *
   * */

  Test('test 2')
    .each([
      {
        desc: 'complex case 1',
        fruits: ['banana', 'orange'],
        vegs: ['tomato'],
      },
      {
        desc: 'complex case 2',
        fruits: ['banana', 'orange'],
        vegs: ['tomato'],
      },
    ])
    .each([{ addition: 'milk' }, { addition: 'ice-cream' }])
    .run(async (t) => {
      console.log(`${t.fruits} ${t.addition}`);
      expect(t.fruits.length).toBeGreaterThan(0);
    });

  describe('entry point to start Test', () => {
    Test()
      .each([{}])
      .run(async (t) => {
        expect(1).toBe(1);
      });
  });
});
