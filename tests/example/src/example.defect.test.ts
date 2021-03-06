describe(`Test with 'defect' example`, () => {
  /*
   * Each case can be marked with defect like below
   *
   * If test marked with defect fails - then runner will skip this test
   *
   * If test marked with defect passes - then runner will fail this case
   * for you to unblock this test
   *
   * you can add 'actualFailReasonParts' to case with defect to check fail reason is expected ot not
   *
   * And also you can mark all tests by defect adding .defect('..reason')
   * */
  its('Defect test')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 10, expected: '12', defect: 'Rounding Error Example' },
      // this will fail
      // { input: 10, expected: '10', defect: 'Rounding Error Example' },
      { input: -6, expected: '-6' },
    ])
    .each([{ formatUnused: 1 }, { formatUnused: 2 }])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Defect test - all tests fail')
    .defect('not implemented')
    .each([
      { input: 0, expected: '0' },
      { input: 10, expected: '10' },
      { input: -6, expected: '-6' },
    ])
    .each([{ formatUnused: 1 }, { formatUnused: 2 }])
    .run(t => {
      throw new Error('not implemented');
    });

  its('Defect test with reasons')
    .each([
      {
        input: 10,
        expected: '12',
        defect: 'Rounding Error Example',
        actualFailReasonParts: ['Expected: "12"', 'Received: "10"'],
      },
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });

  its('Defect with .defect() filtering')
    .each([
      { input: 10, expected: '12' }, // will skip this test
      { input: 10, expected: '10' },
      { input: 10, expected: '13' }, // and will skip this test
    ])
    .defect('Error Example', t => t.expected === '12')
    .defect('Error Example With reasons', t => t.expected === '13', [
      'Expected: "13"',
      'Received: "10"',
    ])
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });
});
