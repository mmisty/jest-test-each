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

  describe('test 2', () => {
    Test()
      .each([{ addition: 'milk' }, { addition: 'ice-cream' }])
      .each([
        {
          desc: 'some desc',
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          desc: (k) => `fruits should not have [${k.vegs}]`,
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          fruits: ['pineapple', 'apple', 'orange'],
          vegs: ['orange'],
        },
      ])
      .each([{ k: 'd' }])
      .run(async (t) => {
        console.log(`${t.fruits} ${t.addition}`);
        expect(t.fruits.length).toBeGreaterThan(0);
      });
  });

  describe('entry point to start Test', () => {
    Test()
      .each([{ c: 'd' }])
      .run(async (t) => {
        expect(1).toBe(1);
      });
  });

  it('sdsd', () => {
    const printf = require('printf');

    const cases = [
      {
        desc: (k) => printf('complex case %s %a', k.fruits),
        fruits: ['banana', 'orange'],
        vegs: ['tomato'],
      },
      {
        desc: (k) => `${k.fruits[0]}`,
        fruits: ['banana', 'orange'],
        vegs: ['tomato'],
      },
    ];

    cases.forEach((k) => {
      console.log(k.desc(k));
    });
  });
});
