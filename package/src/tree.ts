import { getName } from './utils/name';

type OneTest<T> = {
  name: string;
  desc: string | ((k: OneTest<T>) => string);
  flatDesc?: string;
  data: T;
  failCode?: any; //todo
};

type Node<T> = {
  name: string;
  children: Node<T>[]; //todo
  data: T | {};
  previousData: T;
  tests: OneTest<T>[];
};

const createNode = <T>(obj: T, maxTestNameLength: number, parent?: Node<T>): Node<T> => {
  //const objData = typeof obj === 'string' ? {} :obj;
  const name = getName(obj, maxTestNameLength);
  return {
    name: name.name,
    children: [],
    data: obj || {},
    previousData: { ...parent?.previousData, ...obj },
    tests: [],
  };
};
// todo any
const createTree = <T = {}, K = {}>(
  levels: T[][],
  additions: K,
  maxTestNameLength: number,
  onEachNode?: ((c: Node<T>) => Node<T>) | undefined,
  onEachTest?: ((t: OneTest<T>) => OneTest<T>) | undefined,
): Node<T & K> => {
  const root = createNode({}, maxTestNameLength);

  const populateNodes = <K>(node: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const newCases =
        typeof cases === 'function'
          ? (cases as any)({ ...node.previousData, ...additions })
          : cases;

      if (levelNum === levels.length - 1) {
        // last level

        newCases.forEach((p: T) => {
          const name = getName(p, maxTestNameLength);
          const test_: OneTest<any> = {
            name: name.name,
            desc: (p as any).desc || name.name,
            data: { ...node.previousData, ...p, ...additions },
            failCode: name.code,
          };
          const test = onEachTest ? onEachTest(test_) : test_;
          node.tests.push(test as OneTest<any>);
        });
        return;
      } else {
        newCases.forEach((p: any) => {
          const child_ = createNode(p, maxTestNameLength, node);
          const child = onEachNode ? onEachNode(child_) : child_;
          populateNodes(child, levelNum + 1);
          node.children.push(child as Node<any>);
        });
      }
    }
  };

  populateNodes(root);
  return (root as any) as Node<T & K>;
};

const treeWalk = <T>(
  node: Node<T>,
  onEachNode: ((c: Node<T>, i: number, inside: () => void) => void) | undefined,
  onEachTest: (t: OneTest<T>, i: number) => void,
) => {
  node.children.forEach((c, i) => {
    if (onEachNode) {
      onEachNode(c, i, () => treeWalk(c, onEachNode, onEachTest));
    } else {
      treeWalk(c, onEachNode, onEachTest);
    }
  });
  node.tests.forEach((t, i) => {
    onEachTest(t, i);
  });
};

export { OneTest, Node, treeWalk, createTree };
