describe('Test.ensureCasesLength() example', () => {
  /*
   * .ensureCasesLength can be used for checking that cases are not disappeared or added unpredictably
   * because of some dynamic arguments in .each
   *
   * this is useful for complex tests with lot of multiplications
   *
   * the best is to use with inline snapshots - for updating easily (see example below)
   * Updates will be visible on review
   *
   * */

  const data = [{ cloths: 'black shirt' }, { cloths: 'blue shirt' }, { cloths: 'pink shirt' }];

  // this test will fail if cases doesn't have 'shirt'
  its('Ensure cases length test')
    .each(data)
    .each(data)
    .ensureCasesLength(c => c.toMatchInlineSnapshot(`9`))
    .run(async () => {});
});
