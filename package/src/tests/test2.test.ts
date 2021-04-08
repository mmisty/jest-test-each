import { success } from './utils/utils';

describe('Defects', () => {
  its('One defect with filter')
    .each([
      { input: 0, expected: '07' },
      { input: 102.99998, expected: '103' },
      { input: 10, expected: '10' },
    ])
    .defect('SOME_12342', t => t.input === 0)
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('All defected')
    .defect('SOME_12342')
    .each([
      { input: 0, expected: '07' },
      { input: 102.99998, expected: '104' },
      { input: 10, expected: '11' },
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('sdsd')
    // .config(config)
    .each([{ a: '1' }, { a: '2' }])
    .each([{ b: '3' }, { b: '4' }])
    .each([{ c: '3' }, { c: '4' }])
    .add({ k: 0 })
    // .only()
    .run(t => success());
});
