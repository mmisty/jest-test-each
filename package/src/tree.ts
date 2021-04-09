import { getName, NameResult } from './utils/name';

type OneTest<T> = {
  name: NameResult;
  desc: string | ((k: OneTest<T>) => string);
  flatDesc?: string;
  data: T;
  partialData: T;
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

export const mergeSingles = <T>(array: T[][]): T[][] => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].length === 1 && typeof array[i] !== 'function') {
      if (i - 1 >= 0) {
        if (typeof array[i - 1] !== 'function') {
          const el = array[i - 1].map(p => ({ ...p, ...array[i][0] }));
          array[i - 1] = el;
          array[i] = el;
          delete array[i];

          return mergeSingles(array.filter(p => !!p));
        }
      } else {
        if (typeof array[i + 1] !== 'function') {
          if (i + 1 < array.length) {
            const el = array[i + 1].map(p => ({ ...array[i][0], ...p }));
            array[i + 1] = el;
            array[i] = el;

            delete array[i];
            return mergeSingles(array.filter(p => !!p));
          }
        }
      }
    }
  }
  return array;
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

  let levels2 = mergeSingles([...levels]); // todo neewd to eval if function

  const populateNodes = <K>(node: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels2.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const previousData = { ...node.previousData, ...additions };
      const newCases = typeof cases === 'function' ? (cases as any)(previousData) : cases;

      if (levelNum === levels2.length - 1) {
        newCases.forEach((p: T) => {
          const name = getName(p, maxTestNameLength);
          const test_: OneTest<any> = {
            name: name,
            desc: (p as any).desc || name.name,
            data: { ...previousData, ...p },
            partialData: p,
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
