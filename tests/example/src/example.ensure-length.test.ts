describe('Test.ensure() example', () => {
  /*
   * .ensure can be used for evaluating some expression for all test cases
   * .ensure runs separate test with user defined body
   *
   * useful if you what your test to tell you that you missed some case
   *
   * */
  
  // this test will fail if cases doesn't have 'shirt'
  its('Ensure test')
    .each([{ cloths: 'black shirt' }, { cloths: 'blue shirt' }, { cloths: 'pink shirt' }])
    .ensure('every cloths is shirt', t => expect(t.every(k => k.cloths.includes('shirt'))).toBe(true))
    .run(async () => {});
});
