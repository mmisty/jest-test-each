describe('buli', () => {
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

  its('calculator')
    .each(
      [
        { a: 1, b: 2, exp: [3, -1, 2, 0.5] },
        { a: 1, b: 0, exp: [1, 1, 0, Infinity] },
      ].map(p => ({ ...p, desc: p.a + ' and ' + p.b })),
    )
    .each(t => [
      { sign: '+' as const, exp: t.exp[0] },
      { sign: '-' as const, exp: t.exp[1] },
      { sign: '*' as const, exp: t.exp[2] },
      { sign: '/' as const, exp: t.exp[3] },
    ])
    .run(async t => {
      expect(calc(t.a, t.b, t.sign)).toBe(t.exp);
    });
});
