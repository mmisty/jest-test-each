import { createTree, Node } from '../../tree';

describe('tree units', function () {
  const tree = (data: any[][]) => {
    const root = createTree(data, 100);
    let result: string[] = [];
    const byTree = (node: Node<any>, level: number) => {
      result.push(' '.repeat(level * 2) + 'suite: ' + node.name);
      node.tests.forEach(c => {
        result.push(' '.repeat(level * 4) + 'test: ' + c.name.name);
      });
      node.children.forEach((c, i) => {
        byTree(c, level + 1);
      });
    };
    byTree(root, 0);
    return result;
  };

  it('check tree', () => {
    const data: any[][] = [
      [{ abc: 1 }, { abc: 2 }],
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [{ hij: 1 }, { hij: 3 }],
    ];
    const result = tree(data);
    expect(result.join('\n-')).toMatchInlineSnapshot(`
      "suite: 
      -  suite: abc: 1
      -    suite: efg: 1
      -        test: hij: 1
      -        test: hij: 3
      -    suite: efg: 2
      -        test: hij: 1
      -        test: hij: 3
      -    suite: efg: 3
      -        test: hij: 1
      -        test: hij: 3
      -  suite: abc: 2
      -    suite: efg: 1
      -        test: hij: 1
      -        test: hij: 3
      -    suite: efg: 2
      -        test: hij: 1
      -        test: hij: 3
      -    suite: efg: 3
      -        test: hij: 1
      -        test: hij: 3"
    `);
  });

  it('merge tree', () => {
    const data: any[][] = [[{ a: 1 }, { a: 2 }], [{ b: 1 }, { b: 2 }, { b: 3 }], [{ c: 1 }]];
    const result = tree(data);
    expect(result.join('\n-')).toMatchInlineSnapshot(`
      "suite: 
      -  suite: a: 1
      -    test: b: 1, c: 1
      -    test: b: 2, c: 1
      -    test: b: 3, c: 1
      -  suite: a: 2
      -    test: b: 1, c: 1
      -    test: b: 2, c: 1
      -    test: b: 3, c: 1"
    `);
  });

  it('merge tree - 1 single at start', () => {
    const data: any[][] = [[{ a: 1 }], [{ b: 1 }, { b: 2 }, { b: 3 }]];
    const result = tree(data);
    expect(result.join('\n-')).toMatchInlineSnapshot(`
      "suite: 
      -  suite: a: 1
      -    test: b: 1
      -    test: b: 2
      -    test: b: 3"
    `);
  });

  it('merge tree - 1 single in center', () => {
    const data: any[][] = [[{ a: 1 }, { a: 2 }], [{ b: 1 }], [{ c: 1 }, { c: 2 }, { c: 3 }]];
    const result = tree(data);
    expect(result.join('\n-')).toMatchInlineSnapshot(`
      "suite: 
      -  suite: a: 1, b: 1
      -    test: c: 1
      -    test: c: 2
      -    test: c: 3
      -  suite: a: 2, b: 1
      -    test: c: 1
      -    test: c: 2
      -    test: c: 3"
    `);
  });
});
