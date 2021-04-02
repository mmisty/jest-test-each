describe('sds', () => {
  its('sdsd1')
    .each([{ a: 1 }])
    .run(() => {
      expect('1').toBe('1');
    });

  Test('sdsd2')
    .each([{ a: 1 }])
    .each([{ b: 2 }, { b: 6 }])
    .each([{ c: 3 }, { c: 4 }, { c: 5 }])
    .run(() => {
      expect('1').toBe('1');
    });

  Test('test 3')
    .config({ numericCases: true, groupBySuites:false })
    .each([{ a: 1 }])
    .each([{ b: 2 }, { b: 6 }])
    .each([{ c: 3 }, { c: 4 }, { c: 5 }])
    .run(() => {
      expect('1').toBe('1');
    });
});
