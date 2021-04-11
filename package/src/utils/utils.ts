export const guard = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error('From guard: ' + message);
  }
};

export const checkObjEmpty = (obj: any) => {
  return (
    JSON.stringify(obj, (k, v) => {
      if (typeof v === 'function') {
        return 'function';
      }
      if (v === undefined) {
        return 'undefined';
      }
      return v;
    }) === '[{}]'
  );
};
