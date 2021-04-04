describe('Test.before() example', () => {
  /*
   * .before can be used for run parametrised beforeEach depending on cases in test
   * you can use several .before
   * before results are combined into second body argument of its.run()
   * each .before can return dispose: () => void  which will be run after test case execution
   * */
  its('Before test')
    .each([{ cloths: 'black shoes' }, { cloths: 'blue shirt' }])
    .each([{ hat: true }, { hat: false }])
    .before(t => {
      return {
        beforeResult1: t.cloths,
        dispose: () => {
          /* some teardown  */
        },
      };
    })
    .before(t => ({ beforeResult2: t.hat }))
    .each(t => [{ flatDesc: t.cloths + (t.hat ? ' with' : ' without') + ' hat' }])
    .run(async (t, { beforeResult1, beforeResult2 }) => {
      expect(beforeResult1).toBe(t.cloths);
      expect(beforeResult2).toBe(t.hat);
    });
});
