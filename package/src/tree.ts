import { getName, NameResult } from './utils/name';
import { CaseAddition } from './types';

type OneTest<T> = {
  name: NameResult;
  isFlat?: boolean;
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

  const name = getName([obj], maxTestNameLength);
  const node = {
    name: name.name, // todo use code for suite as well
    parent,
    fullData,
    currentData,
    previousData,
    tests: [],
    children: [],
  };
  return node;
};

const mergeNodes = <T>(node: Node<T>, child: Node<T>, maxTestNameLength: number): Node<T> => {
  const fullData = { ...node.fullData, ...child.currentData };
  const currentData = { ...node.currentData, ...child.currentData };
  const previousData = { ...node.previousData };

  const name = getName([node.currentData, child.currentData], maxTestNameLength);
  return {
    name: name.name,
    parent: node.parent,
    fullData,
    currentData,
    previousData,
    tests: [...node.tests, ...child.tests],
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
  const name = getName([node.currentData, test.partialData], maxTestNameLength);

  return {
    name,
    data: fullData,
    partialData,
  };
};

const createTest = <T>(obj: T, parent: Node<T>, maxTestNameLength: number): OneTest<T> => {
  const name = getName([obj], maxTestNameLength);
  return {
    name,
    data: { ...parent.fullData, ...obj },
    partialData: obj,
  };
};
export type ErrorEmitter = { msg?: string; test?: string; details?: string };

// todo any
const createTree = <T extends CaseAddition>(
  levels: T[][],
  maxTestNameLength: number,
  errors: ErrorEmitter[],
  onEachTest: ((t: OneTest<T>) => OneTest<T>) | undefined,
): Node<T> => {
  const root = createNode({}, maxTestNameLength);

  let levels2 = [...levels];

  const populateNode = <K extends CaseAddition>(parent: Node<K>, nextLevel: number = 0) => {
    const levelNum = nextLevel;
    const cases = levels2.length > 0 ? levels2[levelNum] : [];
    const previousData = { ...parent.fullData };
    const normalized = typeof cases === 'function' ? (cases as any)(previousData) : cases;

    if (normalized.length === 0 && !previousData.isEmpty) {
      errors.push({
        msg:
          'every .each should have non empty cases.\nIf it is expected mark cases with "isEmpty:true"',
        test: typeof cases === 'function' ? `${cases}` : `${JSON.stringify(cases)}`,
        details: `${
          typeof cases === 'function'
            ? `each '${cases}' evaluated to an empty array.\n\tArgs {${JSON.stringify(
                previousData,
              )}}`
            : ''
        }`,
      });
    }

    if (levelNum === levels2.length - 1) {
      normalized.forEach((p: T) => {
        const test_ = createTest(p, parent as Node<any>, maxTestNameLength);
        const test = onEachTest ? onEachTest(test_) : test_;
        parent.tests.push(test as OneTest<any>);
      });
      return;
    }

    normalized.forEach((p: any) => {
      const node = createNode(p, maxTestNameLength, parent);
      populateNode(node, levelNum + 1);

      if (node.children.length === 1 && node.tests.length === 0) {
        const newNode = mergeNodes(node, node.children[0], maxTestNameLength);
        node.tests = newNode.tests;
        node.children = newNode.children;
        node.previousData = newNode.previousData;
        node.fullData = newNode.fullData;
        node.currentData = newNode.currentData;
        node.name = newNode.name;
      }

      if (node.tests.length === 1 && node.children.length === 0) {
        const test = mergeNodeAndTest(node, node.tests[0], maxTestNameLength);
        node.parent?.tests.push(test) || parent.tests.push(test);
        return;
      }

      if (node.tests.length === 0 && node.children.length === 0) {
        return;
      }

      parent.children.push(node as Node<any>);
    });
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
