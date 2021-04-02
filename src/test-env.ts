
export type Runner = (name: string, body: () => void) => void;

export type Env = {
  suiteRunner: Runner;
  testRunner: Runner;
};