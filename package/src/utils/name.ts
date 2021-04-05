export type CodeRename = 'NAME_TOO_LONG' | 'NAME_HAS_FUNCTIONS';
export enum CODE_RENAME {
  nameTooLong = 'NAME_TOO_LONG',
  nameHasFunctions = 'NAME_HAS_FUNCTIONS',
}
export const getName = <T>(obj: T, maxLength: number): { name: string; code?: CodeRename } => {
  // should not throw here

  const untypedObj = { ...(obj as any) };
  const desc = untypedObj.desc;
  const flatDesc = untypedObj.flatDesc;
  let code: CodeRename | undefined = undefined;

  if (!objHasNoFunctions(obj) && !desc) {
    code = CODE_RENAME.nameHasFunctions;
  }

  const result =
    flatDesc ||
    (desc ? (typeof desc === 'function' ? desc(untypedObj) : desc) : getNameInt(untypedObj));

  if (result.length > maxLength) {
    code = CODE_RENAME.nameTooLong;
  }

  return { name: result, code };
};

const isSimple = (obj: any) => {
  return typeof obj === 'string' || typeof obj === 'number';
};

export const addQuotes = (str: string | number): string | number => {
  if (typeof str === 'number') {
    return str;
  }
  const newStr = str.toString().replace(/"|'/g, '');
  const match = newStr.match(/^[\w\d]+$/g);
  return match && match.length > 0 ? newStr : `'${newStr}'`;
};

const getNameInt = (obj: any): string => {
  const joinSymbol = ', ';
  return Object.getOwnPropertyNames(obj)
    .filter(p => p !== 'desc')
    .map(p => {
      if (Array.isArray(obj[p])) {
        return `${p}: [${obj[p]
          .map((k: any) => (isSimple(k) ? addQuotes(k) : getNameInt(k)))
          .join(joinSymbol)}]`;
      }

      if (typeof obj[p] === 'function') {
        return `${p}: function`;
      }

      if (typeof obj[p] === 'object') {
        return `${p}: {${Object.getOwnPropertyNames(obj[p])
          .map(k => (isSimple(obj[p][k]) ? `${addQuotes(k)}: ${obj[p][k]}` : getNameInt(obj[p][k])))
          .join(joinSymbol)}}`;
      }

      return `${p}: ${addQuotes(obj[p])}`;
    })
    .join(joinSymbol);
};

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
