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
          const name = getName(p, maxTestNameLength);

          node.tests.push({
            name: name.name,
            desc: (p as any).desc || name.name,
            data: { ...node.previousData, ...p },
            failCode: name.code,
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
