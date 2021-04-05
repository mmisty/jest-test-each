import { objHasNoFunctions } from '../../utils/name';

describe('check', () => {
  let res = false;
  it('no func', () => {
    res = objHasNoFunctions({ simple: '123' });
    expect(res).toBe(true);
  });

  it('func - has func', () => {
    res = objHasNoFunctions({ simple: '123', abc: () => {} });
    expect(res).toBe(false);
  });

  it('no func - array', () => {
    res = objHasNoFunctions({ simple: '123', abc: [{ p: 1 }, { p: 2 }] });
    expect(res).toBe(true);
  });

  it('no func - object', () => {
    res = objHasNoFunctions({ simple: '123', abc: { some: { p: 1 }, some2: { p: 2 } } });
    expect(res).toBe(true);
  });

  it('func - array', () => {
    res = objHasNoFunctions({ simple: '123', abc: [{ p: 1 }, { p: () => 2 }] });
    expect(res).toBe(false);
  });

  it('func - object', () => {
    res = objHasNoFunctions({ simple: '123', abc: { some: { p: 1 }, some2: { p: () => 2 } } });
    expect(res).toBe(false);
  });
});
