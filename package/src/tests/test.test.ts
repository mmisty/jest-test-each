import { delay, success } from './utils/utils';

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
    .each(t => [{ abc: '1', desc: (k: { abc: string }) => k.abc }]) // todo
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

  its('Only one test without cases')
    //.only() // this could not be committed as far as guard is implemented
    .run(t => {
      success();
    });

  its('Some test')
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '3' }, { b: '4' }])
    //.only()
    .run(t => success());

  its('Before test')
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '3' }, { b: '4' }])
    .before(t => {
      console.log('before each1');
      return {
        someResult: 'a',
        dispose: () => console.log('After Each1'),
      };
    })
    .before(t => {
      console.log('before each2');
      return {
        someResult1: 'b',
        dispose: () => console.log('After Each2'),
      };
    })
    .run(async (t, b) => {
      expect(b.someResult).toBe('a');
      expect(b.someResult1).toBe('b');
      await delay(100);
    });

  its('Before test - no dispose')
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '3' }, { b: '4' }])
    .before(t => {
      console.log('before each');
      return {
        someResult: 'a',
      };
    })
    // .only()
    .run(async (t, { someResult }) => {
      expect(someResult).toBe('a');
    });

  its('Only one test')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .each([{ formatUnused: 1 }, { formatUnused: 2 }])
    // .only()
    // .only(t => t.expected === '1' && t.formatUnused === 2)
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Defected test')
    .each([
      { input: 0, expected: '0' },
      { input: 102.99998, expected: '104', defect: 'Rounding Error' },
      // { input: 10, expected: '10', defect: 'Rounding Error 2' },
    ])
    // .only(t=> t.expected==='104')
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Ensure cases')
    .each([
      { input: 0, expected: '0' },
      { input: 102.99998, expected: '103' },
      { input: 10, expected: '10' },
    ])
    .ensure('all cases snapshot', t =>
      expect(t.map(p => p.input)).toMatchInlineSnapshot(`
        Array [
          0,
          102.99998,
          10,
        ]
      `),
    )
    .ensureCasesLength(a => a.toMatchInlineSnapshot(`3`))
    // .only()
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });
});
