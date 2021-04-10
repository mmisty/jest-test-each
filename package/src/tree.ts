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
  parent?: Node<T>;
  fullData: T | {};
  currentData: T | {};
  previousData: T | {};
  tests: OneTest<T>[];
};

const createNode = <T>(obj: T, maxTestNameLength: number, parent?: Node<T>): Node<T> => {
  const fullData = { ...parent?.fullData, ...obj } || {};
  const currentData = obj || {};
  const previousData = parent?.fullData || {};

  const name = getName(obj, maxTestNameLength);
  return {
    name: name.name,
    parent,
    fullData,
    currentData,
    previousData,
    tests: [],
    children: [],
  };
};

const mergeNodes = <T>(node: Node<T>, child: Node<T>, maxTestNameLength: number): Node<T> => {
  const fullData = { ...node.fullData, ...child.currentData } || {};
  const currentData = { ...node.currentData, ...child.currentData } || {};
  const previousData = { ...node?.previousData } || {};

  const name = getName(currentData, maxTestNameLength);
  return {
    name: name.name,
    parent: node.parent,
    fullData,
    currentData,
    previousData,
    tests: [],
    children: [],
  };
};

const mergeNodeAndTest = <T>(
  node: Node<T>,
  test: OneTest<T>,
  maxTestNameLength: number,
): OneTest<T> => {
  const fullData = { ...node.fullData, ...test.partialData };
  const partialData = { ...node.currentData, ...test.partialData };
  const name = getName(partialData, maxTestNameLength);

  return {
    name: name,
    desc: (partialData as any).desc || name,
    data: fullData,
    partialData,
    // flatDesc: (fullData as any).flatDesc // todo
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

  let levels2 = [...levels];

  const populateNodes = <K>(node: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels2.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }
      const previousData = { ...node.fullData, ...additions };
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
        if (newCases.length === 1) {
          const obj = { ...newCases[0], ...additions };
          const newNode = createNode(obj, maxTestNameLength, node);
          //const newNode = mergeNodes(node, obj, maxTestNameLength);
          populateNodes(newNode, levelNum + 1);
          if (newNode.children.length === 1) {
            node = mergeNodes(newNode, newNode, maxTestNameLength); //todo
          }
          const nodeee = { ...newNode };
          nodeee.tests.forEach(tt => {
            node.tests.push(mergeNodeAndTest(newNode, tt, maxTestNameLength));
          });
        } else {
          newCases.forEach((p: any) => {
            const child_ = createNode(p, maxTestNameLength, node);
            const child = onEachNode ? onEachNode(child_) : child_;
            populateNodes(child, levelNum + 1);
            
            if (child.children.length > 1 || child.tests.length > 1) {
              node.children.push(child as Node<any>);
            } else if (child.children.length === 1) {
              node = mergeNodes(child, child, maxTestNameLength); //todo
            } else {
              const nodeee = { ...child };
              nodeee.tests.forEach((tt: any) => {
                node.tests.push(mergeNodeAndTest(child, tt, maxTestNameLength));
              });
            }
          });
        }
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
