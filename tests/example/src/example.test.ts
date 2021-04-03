import { calc, delay } from './functions';

describe('test examples', () => {
  its('Simple test: roundings')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Cases multiplication: check calculator')
    .each([
      { a: 1, b: 2, exp: [3, -1, 2, 0.5] },
      { a: 1, b: 0, exp: [1, 1, 0, Infinity] },
    ])
    .each(t => [
      { sign: '+' as const, exp: t.exp[0] },
      { sign: '-' as const, exp: t.exp[1] },
      { sign: '*' as const, exp: t.exp[2] },
      { sign: '/' as const, exp: t.exp[3] },
    ])
    .run(async t => {
      expect(calc(t.a, t.b, t.sign)).toBe(t.exp);
    });

  its('Flat description')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .each(t => [{ flatDesc: `Input ${t.input} should be rounded to ${t.expected}` }])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('User defined description for test')
    .each([
      { input: 0, expected: '0', desc: 'Special case - zero' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('User defined description for test depending on case type')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      {
        input: 102.99998,
        expected: '103',
        desc: k => `Description for case with input ${k.input}`,
      },
      { input: -6, expected: '-6' },
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Concurrent test')
    .concurrent()
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .run(async t => {
      await delay(1000);
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Only one test')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    // .only() // this could not be committed as far as guard is implemented
    // .only((t) => t.expected === "1") // this could not be committed as far as guard is implemented
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });
  describe('wrapper', () => {
    its()
      .each([
        { input: 0, expected: '0' },
        { input: 0.99, expected: '1' },
        { input: 102.99998, expected: '103' },
        { input: -6, expected: '-6' },
      ])
      .run(t => {
        expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
      });
  });
});
