export const guard = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error('From guard: ' + message);
  }
};

export const mergeIntoOne = (objArray: any[]) => {
  let aggregated = {};
  objArray.forEach(p => (aggregated = { ...aggregated, ...p }));
  return aggregated;
};
