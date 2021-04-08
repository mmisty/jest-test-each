import { createTree, Node } from '../../tree';

describe('units', function () {
  it('check tree', () => {
    const data: any[][] = [
      [{ abc: 1 }, { abc: 2 }],
      [{ efg: 1 }, { efg: 2 }, { efg: 3 }],
      [{ hij: 1 }, { hij: 3 }],
    ];

    const root = createTree(data, {}, 100);
    let result: string[] = [];
    const byTree = (node: Node<any>, level: number) => {
      result.push(' '.repeat(level * 2) + 'suite:' + node.name);
      node.tests.forEach(c => {
        result.push(' '.repeat(level * 4) + 'test:' + c.name.name);
      });
      node.children.forEach((c, i) => {
        byTree(c, level + 1);
      });
    };

    byTree(root, 0);
    expect(result.join('\n-')).toMatchInlineSnapshot(`
      "suite:
      -  suite:abc: 1
      -    suite:efg: 1
      -        test:hij: 1
      -        test:hij: 3
      -    suite:efg: 2
      -        test:hij: 1
      -        test:hij: 3
      -    suite:efg: 3
      -        test:hij: 1
      -        test:hij: 3
      -  suite:abc: 2
      -    suite:efg: 1
      -        test:hij: 1
      -        test:hij: 3
      -    suite:efg: 2
      -        test:hij: 1
      -        test:hij: 3
      -    suite:efg: 3
      -        test:hij: 1
      -        test:hij: 3"
    `);
  });
});
