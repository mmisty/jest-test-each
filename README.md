# jest-test-each

Will help you to run parametrized tests easily [typesafe] without text tables or arrays of arrays.

### Features: 
1. cases multiplication
2. ability to setup test-each: number cases or not, group each level by suite or not
2. ability to specify description for each case as func depending on case args
3. ability to create .each level depending on previous levels
4. ability to not group by suites when each case has 'flatDesc'

Example:
```typescript 
// Example 1


```

## Unavailable: 

1. To run one test from TestEach (workaround - commenting cases)
2. To start testEach by Idea plugin (workaround - wrap with describe and do not put name into Test Each)