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
  fullData: T;
  currentData: T;
  previousData: T | {};
  tests: OneTest<T>[];
};

const createNode = <T>(obj: T, maxTestNameLength: number, parent?: Node<T>): Node<T> => {
  const fullData = { ...parent?.fullData, ...obj };
  const currentData = { ...obj };
  const previousData = { ...parent?.fullData };

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
  const fullData = { ...node.fullData, ...child.currentData };
  const currentData = { ...node.currentData, ...child.currentData };
  const previousData = { ...node.previousData };

  const name = getName(currentData, maxTestNameLength);
  return {
    name: name.name,
    parent: node.parent,
    fullData,
    currentData,
    previousData,
    tests: [...child.tests],
    children: [...child.children],
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
  };
};

const createTest = <T>(obj: T, parent: Node<T>, maxTestNameLength: number): OneTest<T> => {
  const name = getName(obj, maxTestNameLength);
  return {
    name,
    desc: (obj as any).desc || name.name,
    data: { ...parent.fullData, ...obj },
    partialData: obj,
  };
};

// todo any
const createTree = <T = {}>(
  levels: T[][],
  maxTestNameLength: number,
  onEachTest?: ((t: OneTest<T>) => OneTest<T>) | undefined,
): Node<T> => {
  const root = createNode({}, maxTestNameLength);

  let levels2 = [...levels];

  const populateNode = <K>(parent: Node<K>, nextLevel: number = 0) => {
    for (const [levelNum, cases] of levels2.entries()) {
      if (nextLevel !== levelNum) {
        continue;
      }

      const previousData = { ...parent.fullData };
      const normalized = typeof cases === 'function' ? (cases as any)(previousData) : cases;

      if (levelNum < levels2.length - 1) {
        if (normalized.length === 1) {
          const obj = { ...normalized[0] };
          const node = createNode(obj, maxTestNameLength, parent);

          populateNode(node, levelNum + 1);

          if (node.children.length > 0 || node.tests.length > 0) {
            const merged = mergeNodes(parent, node, maxTestNameLength);

            if (merged.tests.length === 1) {
              parent.tests.push(mergeNodeAndTest(merged, merged.tests[0], maxTestNameLength));
            } else {
              if (parent.parent) {
                parent.parent.children.push(merged);
              } else {
                parent.children.push(merged);
              }
            }
          }
        } else {
          normalized.forEach((p: any) => {
            const child = createNode(p, maxTestNameLength, parent);
            populateNode(child, levelNum + 1);

            if (child.children.length > 1 || child.tests.length > 1) {
              parent.children.push(child as Node<any>);
            } else if (child.children.length === 1) {
              parent.children.push(mergeNodes(child, child.children[0], maxTestNameLength));
            } else {
              child.tests.forEach((test: any) => {
                parent.tests.push(mergeNodeAndTest(child, test, maxTestNameLength));
              });
            }
          });
        }
      } else {
        normalized.forEach((p: T) => {
          const test_ = createTest(p, parent as Node<any>, maxTestNameLength);
          const test = onEachTest ? onEachTest(test_) : test_;
          parent.tests.push(test as OneTest<any>);
        });
      }
    }
  };

  populateNode(root);
  return (root as any) as Node<T>;
};

const treeWalk = <T>(
  node: Node<T>,
  onEachNode: (c: Node<T>, i: number, inside: () => void) => void,
  onEachTest: (t: OneTest<T>, i: number) => void,
) => {
  node.children.forEach((c, i) => onEachNode(c, i, () => treeWalk(c, onEachNode, onEachTest)));
  node.tests.forEach((t, i) => {
    onEachTest(t, i);
  });
};

export { OneTest, Node, treeWalk, createTree };
