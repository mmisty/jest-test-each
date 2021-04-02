export const getName = <T>(obj: T) => {
  const untypedObj = obj as any;
  const desc = untypedObj.desc;
  const flatDesc = untypedObj.flatDesc;
  const combined = () =>
    Object.getOwnPropertyNames(obj)
      .filter(p => p !== 'desc')
      .map(p => {
        if (Array.isArray(untypedObj[p])) {
          return `${p}: [${untypedObj[p]}]`;
        }

        if (typeof untypedObj[p] === 'object') {
          return `${p}: ${JSON.stringify(untypedObj[p])}`;
        }

        return `${p}: ${untypedObj[p]}`;
      })
      .join(', ');

  return flatDesc || (desc ? (typeof desc === 'function' ? desc(obj) : desc) : combined());
};
