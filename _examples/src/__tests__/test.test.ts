describe('calculator', () => {
  const calc = (a: number, b: number, sign: '+' | '-' | '*' | '/') => {
    switch (sign) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      default:
        throw new Error('Unknown sign');
    }
  };

  its('check calculator')
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
    // .each(t => [{ flatDesc: `${t.a} ${t.sign} ${t.b} should be ${t.exp}` }])
    .run(async t => {
      expect(calc(t.a, t.b, t.sign)).toBe(t.exp);
    });

  its('roundings')
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
