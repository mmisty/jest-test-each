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
5. [Releases](#releases)

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

To setup jest you need to have jest.config.js config ([official details](https://jestjs.io/docs/configuration))

In your jest.config.js config add:
```javascript
// jest.config.js
module.exports = {
  ...
  setupFilesAfterEnv: ["./config/setup.js"],
  ...
};
```

In './config/setup.js' file add the following (this is required for global vars to be available):
```
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

#### Additional [optional]

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
- [x] To run one test from TestEach like it.only (`.only(<filter>)`) ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.only.test.ts)).
- [x] ability to run '.before' in testEach with disposable interface for automatic cleanup ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.before.test.ts)).
- [x] ability to skip test if it is marked with defect ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.defect.test.ts)).
- [x] added field 'actualFailReasonParts' for case - to fail when defected test fails with other reason than expected ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.defect.test.ts)).
- [x] '.ensure' to check cases match some condition ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.ensure.test.ts)).
- [x] '.ensureCasesLength' to check cases length  - in case when .each has dynamic args and you don't want to miss some tests ([example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.ensure-length.test.ts)).
- [x] ability to skip test
- [x] do not create suite wrapping when resulted to only one test in the group

### .only() usage

See [example](https://github.com/mmisty/jest-test-each/blob/main/tests/example/src/example.only.test.ts).

Running the feature containing this will result in 2 tests

```javascript
  its('Simple test: roundings')
    .each([
      { input: 0, expected: '0' },
      { input: 0.99, expected: '1' },
      { input: 102.99998, expected: '103' },
      { input: -6, expected: '-6' },
    ])
    .only(t => t.input === -6)
    .run(t => {
      expect(Math.round(t.input).toFixed(0)).toBe(t.expected);
    });
```

![](https://github.com/mmisty/jest-test-each/blob/main/package/docs/only.png)

## What's next

- [ ] todo

## Unavailable features
1. to start testEach by Idea plugin (**workaround**: wrap with describe and do not put name into Test Each)

## Releases

### 0.9.0
Supporting jest 27.

Working with Skip and Defect: 
1. When using test-runner 'jest-circus' (default runner in jest 27):
     - defected tests which fail will not be marked skipped as it was before, it will be marked as passed.
     - defected tests which passed will fail as before 
     - skipping test will not run test but it will be marked as passed
2. When using test runner 'jest-jasmine2' everything will be as before. 
You can add the following in jest.config.js to use 'jest-jasmine2' runner:
    ```json
     test-runner: "jest-jasmine2"
    ```


### 0.8.8
- Ability to add flatDesc to cases simplier - as function for each (.each(..).desc(t=>...))