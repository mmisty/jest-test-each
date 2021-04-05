import { addQuotes, objHasNoFunctions } from '../../utils/name';

describe('name tests', () => {
  it('add quotes', () => {
    const strings = [
      { str: 'str1 and str2', exp: "'str1 and str2'" },
      { str: 'str1', exp: 'str1' },
      { str: "str1 with 'quotes'", exp: "'str1 with quotes'" },
    ];

    strings.forEach(p => {
      let t = addQuotes(p.str);
      expect(t).toBe(p.exp);
    });
  });

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
});
