import { createTree } from '../../tree';
/*
describe('merge singles', function () {
  it('no single', () => {
    expect(
      createTree([
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ hij: 1 }, { hij: 3 }],
      ], {}, 200),
    ).toEqual([
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [{ hij: 1 }, { hij: 3 }],
    ]);
  });

  it('one single (start)', () => {
    expect(
      createTree([[{ abc: 1 }], [{ efg: 1 }, { efg: 2 }, { efg: 3 }], [{ hij: 1 }, { hij: 3 }]], {}, 200),
    ).toEqual([
      [
        { abc: 1, efg: 1 },
        { abc: 1, efg: 2 },
        { abc: 1, efg: 3 },
      ],
      [{ hij: 1 }, { hij: 3 }],
    ]);
  });

  it('one single (center)', () => {
    expect(
      createTree([[{ efg: 1 }, { efg: 2 }, { efg: 3 }], [{ abc: 1 }], [{ hij: 1 }, { hij: 3 }]], {}, 200),
    ).toEqual([
      [
        { efg: 1, abc: 1 },
        { efg: 2, abc: 1 },
        { efg: 3, abc: 1 },
      ],
      [{ hij: 1 }, { hij: 3 }],
    ]);
  });

  it('one single (end)', () => {
    expect(
      createTree([[{ efg: 1 }, { efg: 2 }, { efg: 3 }], [{ hij: 1 }, { hij: 3 }], [{ abc: 1 }]], {}, 200),
    ).toEqual([
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [
        { hij: 1, abc: 1 },
        { hij: 3, abc: 1 },
      ],
    ]);
  });

  it('2 sinlges at start', () => {
    expect(
      createTree([
        [{ abc: 1 }],
        [{ def: 1 }],
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ hij: 1 }, { hij: 3 }],
      ], {}, 200),
    ).toEqual([
      [
        { abc: 1, def: 1, efg: 1 },
        { abc: 1, def: 1, efg: 2 },
        { abc: 1, def: 1, efg: 3 },
      ],
      [{ hij: 1 }, { hij: 3 }],
    ]);
  });

  it('2 singles at center', () => {
    expect(
      createTree([
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ abc: 1 }],
        [{ def: 1 }],
        [{ hij: 1 }, { hij: 3 }],
      ], {}, 200),
    ).toEqual([
      [
        { efg: 1, abc: 1, def: 1 },
        { efg: 2, abc: 1, def: 1 },
        { efg: 3, abc: 1, def: 1 },
      ],
      [{ hij: 1 }, { hij: 3 }],
    ]);
  });
  
  it('2 singles at ed', () => {
    expect(
      createTree([
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ hij: 1 }, { hij: 3 }],
        [{ abc: 1 }],
        [{ def: 1 }],
      ], {}, 200),
    ).toEqual([
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [{ hij: 1,abc: 1,def: 1  }, { hij: 3,abc: 1,def: 1  }],
    ]);
  });

  it('check tree - 2 sinlges at start and at end', () => {
    expect(
      createTree([
        [{ def: 1 }],
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ hij: 1 }, { hij: 3 }],
        [{ abc: 1 }],
      ], {}, 200),
    ).toEqual([
      [
        { def: 1, efg: 1 },
        { def: 1, efg: 2 },
        { def: 1, efg: 3 },
      ],
      [
        { hij: 1, abc: 1 },
        { hij: 3, abc: 1 },
      ],
    ]);
  });

  it('check tree - 2 sinlges at start and at end', () => {
    expect(
      createTree([
        [{ def: 1 }],
        [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
        [{ hij: 1 }],
        [{ abc: 1 }],
      ], {}, 200),
    ).toEqual([
      [
        { def: 1, efg: 1, hij: 1, abc: 1 },
        { def: 1, efg: 2, hij: 1, abc: 1 },
        { def: 1, efg: 3, hij: 1, abc: 1 },
      ],
    ]);
  });
});
*/
