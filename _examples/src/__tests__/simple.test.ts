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
      .each([{ abc: 'abc' }, { abc: 'def' }])
      .each((t) => [
        { addition: 'milk=' + t.abc },
        { addition: 'ice-cream=' + t.abc },
      ])
       .each((t) => [
        {
          desc: 'some desc:' + t.addition,
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          desc: (k) => `fruits should not have [${k.vegs}, ${t.abc}]`,
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          fruits: ['pineapple', 'apple', 'orange'],
          vegs: ['orange'],
        },
      ])
      .each((t) => [{ de: 'd' }])
      .run(async (t) => {
        console.log(`${t.fruits} ${t.addition}`);
        expect(t.fruits.length).toBeGreaterThan(0);
      });
  });
  
describe('test 3 flat', () => {
    Test()
      .each([{ abc: 'abc' }, { abc: 'def' }])
      .each((t) => [
        { addition: 'milk=' + t.abc },
        { addition: 'ice-cream=' + t.abc },
      ])
       .each((t) => [
        {
          desc: 'some desc:' + t.addition,
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          desc: (k) => `fruits should not have [${k.vegs}, ${t.abc}]`,
          fruits: ['banana', 'orange'],
          vegs: ['tomato'],
        },
        {
          fruits: ['pineapple', 'apple', 'orange'],
          vegs: ['orange'],
        },
      ])
      .each((t) => [{ descCase: `should be ${t.abc} and ${t.addition}` }])
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
  
  
  Test('')

});
