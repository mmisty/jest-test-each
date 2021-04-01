# jest-test-each

Will help you to run parametrized tests easily [typesafe] without text tables or arrays of arrays.

### Features:

1. cases multiplication
2. ability to setup test-each: number cases or not, group each level by suite or not
3. ability to specify description for each case as func depending on case args
4. ability to create .each level depending on previous levels
5. ability to not group by suites when each case has 'flatDesc'
6. global var 'Test' (or 'its' alias) to access test each (accepting suggestions on naming)

### Examples

#### Simple

```typescript
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
```

Run test in idea with jest plugin:

![](./docs/roundings.png)

#### More complex

```typescript
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
  .each(t => [{ flatDesc: `${t.a} ${t.sign} ${t.b} should be ${t.exp}` }])
  .run(async t => {
    expect(calc(t.a, t.b, t.sign)).toBe(t.exp);
  });
```

![](./docs/calc.png)

and the same test with auto cases names:

![](./docs/calc2.png)

## Unavailable:

1. To run one test from TestEach (workaround - commenting cases/filtering)
2. To start testEach by Idea plugin (workaround - wrap with describe and do not put name into Test Each)
