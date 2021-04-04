# jest-test-each

This package will help you to run parametrised tests easily [typesafe] without text tables or arrays of arrays.

![](https://img.shields.io/badge/License-MIT-yellow.svg)
![](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
[![GitHub watchers](https://img.shields.io/github/watchers/mmisty/jest-test-each.svg?style=social)](https://github.com/mmisty/jest-test-each/watchers)

## Table of Contents

1. [Examples](#examples)
2. [Setup](#setup)
3. [Features](#features)
4. [What's next](#whats-next)

## Examples

You can see demo project [here](https://github.com/mmisty/jest-test-each/blob/main/tests/example).

Tests are [here](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src).

### Simple

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

![](https://github.com/mmisty/jest-test-each/blob/main/package/docs/roundings.png)

### More complex

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

![](https://github.com/mmisty/jest-test-each/blob/main/package/docs/calc.png)

and the same test with auto cases names:

![](https://github.com/mmisty/jest-test-each/blob/main/package/docs/calc2.png)

## Setup

Install dev dependency:

```
yarn add -D jest-test-each
```

Add the following into your config setup.js file which is referred in jest.config.js - setupFilesAfterEnv section:

```
// Looking a way to improve this. Can anyone help ?)
require('jest-test-each');
```

for .ts tests to see globals 'its' and 'Test' add the following to your tsconfig:

```
// tsconfig.json
 "include": [
    ...
    "node_modules/jest-test-each/dist/index.d.ts"
  ]
```

#### Additional

You can override test runner environment (by default it is jest env) by the following:

```javascript
TestEachEnv({
  describe: describe,
  it: it,
  beforeAll: beforeAll,
  ...
});
```

## Features

- [x] cases multiplication (`.each().each()....run()`)
- [x] ability to setup test-each (global setup or each test setup):
  - number suites/cases or not
  - group each level by suite or not
  - concurrent testing
  - max length of case name - on reaching it will ask to sepcify explicit description for case
- [x] ability to setup test runner environment (by default it is jest)
- [x] ability to specify description for each case as function depending on case args
- [x] ability to create .each level depending on previous data
- [x] ability to have flat tests cases (not groupped to suites) when each case has 'flatDesc'
- [x] global var 'Test' (or 'its' alias) to access test each (I'm accepting suggestions on namings)
- [x] ability to run without single .each (`its('foo').run(..)`)
- [x] To run one test from TestEach like it.only (`.only(<filter>)`)
- [x] ability to run '.before' in testEach with disposable interface for automatic cleanup
- [ ] To start testEach by Idea plugin (**workaround**: wrap with describe and do not put name into Test Each)

## What's next

- [ ] add '.ensureCases' to testEach with to check case num with inlineSnapshot
- [ ] do not create suite wrapping when only one test in the group
- [ ] add ability to skip test if it is marked by defect
