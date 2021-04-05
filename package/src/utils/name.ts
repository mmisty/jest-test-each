export type CodeRename = 'NAME_TOO_LONG' | 'NAME_HAS_FUNCTIONS';
export enum CODE_RENAME {
  nameTooLong = 'NAME_TOO_LONG',
  nameHasFunctions = 'NAME_HAS_FUNCTIONS',
}
export const getName = <T>(obj: T, maxLength: number): { name: string; code?: CodeRename } => {
  // should not throw here

  const untypedObj = obj as any;
  const desc = untypedObj.desc;
  const flatDesc = untypedObj.flatDesc;
  let code: CodeRename | undefined = undefined;

  if (!objHasNoFunctions(obj) && !desc) {
    code = CODE_RENAME.nameHasFunctions;
  }

  const result =
    flatDesc || (desc ? (typeof desc === 'function' ? desc(obj) : desc) : getNameInt(obj));

  if (result.length > maxLength) {
    code = CODE_RENAME.nameTooLong;
  }

  return { name: result, code };
};

const isSimple = (obj: any) => {
  return typeof obj === 'string' || typeof obj === 'number';
};
type TooComplexObj = 'Too complex obj - specify desc';

export const objHasNoFunctions = (obj: any, result: boolean = false): boolean => {
  return (
    typeof obj === 'function' ||
    Object.keys(obj)
      .filter(k => k !== 'desc')
      .every(p => {
        if (typeof obj[p] === 'function') {
          return false;
        }

        if (isSimple(obj[p])) {
          return true;
        }

        if (Array.isArray(obj[p])) {
          return obj[p].every((k: any) => (isSimple(k) ? k : objHasNoFunctions(k)));
        }

        return objHasNoFunctions(obj[p], result);
      })
  );
};

const getNameInt = (obj: any): string | TooComplexObj => {
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
        return `${p}: function`;
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
