export const getName = <T>(obj: T): string => {
  const untypedObj = obj as any;
  const desc = untypedObj.desc;
  const flatDesc = untypedObj.flatDesc;
  const result =
    flatDesc || (desc ? (typeof desc === 'function' ? desc(obj) : desc) : getNameInt(obj));

  if (result.length > 100) {
    throw new Error('Case name is too long (>100 symbols), please specify desc');
  }

  return result;
};

const isSimple = (obj: any) => {
  return typeof obj === 'string' || typeof obj === 'number';
};

const getNameInt = (obj: any): string => {
  if (typeof obj === 'function') {
    throw new Error(`Too complex obj in test - please specify 'desc' for the case`);
  }
  const joinSymbol = ', ';
  return Object.getOwnPropertyNames(obj)
    .filter(p => p !== 'desc')
    .map(p => {
      if (Array.isArray(obj[p])) {
        return `${p}: [${obj[p]
          .map((k: any) => (isSimple(k) ? k : getNameInt(k)))
          .join(joinSymbol)}]`;
      }

      if (typeof obj[p] === 'function') {
        throw new Error(`Too complex obj in test - please specify 'desc' for the case`);
      }

      if (typeof obj[p] === 'object') {
        return `${p}: {${Object.getOwnPropertyNames(obj[p])
          .map(k => (isSimple(obj[p][k]) ? `${k}: ${obj[p][k]}` : getNameInt(obj[p][k])))
          .join(joinSymbol)}}`;
      }

      return `${p}: ${obj[p]}`;
    })
    .join(joinSymbol);
};
