import { tree } from '../../../src';

describe('units', function () {
  it('node', () => {
    const data: any[][] = [
      [{ abc: 1 }, { abc: 2 }],
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [{ hij: 1 }, { hij: 3 }],
    ];
    /*
    abc 1
    --efg 1
    ----hij 1 test
    ----hij 3 test
    --efg 2
    ----hij 1 test
    --efg 3
    ----hij 1 test
    abc 2
    --efg 1
    ----hij
    --efg 2
    ----hij 1
    --efg 3
    ----hij 1
    * */

    const nodes = tree(data);
    expect(nodes).toEqual({ a: '' });
  });
});
