export const guard = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error('From guard: ' + message);
  }
};
