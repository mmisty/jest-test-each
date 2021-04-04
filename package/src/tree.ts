import { getName } from './utils/name';

type OneTest<T> = {
  name: string;
  desc: string | ((k: OneTest<T>) => string);
  flatDesc?: string;
  data: T;
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
  return {
    name: getName(obj, maxTestNameLength),
    children: [],
    data: obj || {},
    previousData: { ...parent?.previousData, ...obj },
    tests: [],
  };
};

const createTree = <T = {}>(levels: T[][], maxTestNameLength: number): Node<T> => {
  const root = createNode({}, maxTestNameLength);

  const populateNodes = <K>(node: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const newCases = typeof cases === 'function' ? (cases as any)(node.previousData) : cases;

      if (levelNum === levels.length - 1) {
        // last level

        newCases.forEach((p: T) => {
          node.tests.push({
            name: getName(p, maxTestNameLength),
            desc: (p as any).desc || getName(p, maxTestNameLength),
            data: { ...node.previousData, ...p },
          });
        });
        return;
      } else {
        newCases.forEach((p: any) => {
          const child = createNode(p, maxTestNameLength, node);
          populateNodes(child, levelNum + 1);
          node.children.push(child);
        });
      }
    }
  };

  populateNodes(root);
  return (root as any) as Node<T>;
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
