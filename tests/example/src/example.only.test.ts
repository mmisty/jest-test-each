describe('Test.only() example', () => {
  /*
   * using only() will run 2 tests:
   * 1 - one test from test file from suite where only is used
   * 2 - and second test 'only() should be removed before committing' which will fail =>
   *     this way you will not forget to remove .only()
   *
   *
   * Only can be used without arguments then the first test from each group will be run
   * Only can be used with argument to filter which case to run
   * See commented below
   * */
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
});
