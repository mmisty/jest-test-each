import { merge } from './utils';

export type CodeRename = 'NAME_TOO_LONG' | 'NAME_HAS_FUNCTIONS';
export enum CODE_RENAME {
  nameTooLong = 'NAME_TOO_LONG',
  nameHasFunctions = 'NAME_HAS_FUNCTIONS',
}

export const messageFromRenameCode = (code: CodeRename, maxLength: number) => {
  switch (code) {
    case CODE_RENAME.nameTooLong: {
      return `Automatic test name is too long (>${maxLength}symbols). Please add 'desc' to case.`;
    }
    case CODE_RENAME.nameHasFunctions: {
      return `Test case data has functions in it. Please add 'desc' to case.`;
    }
    default:
      return 'unknown code';
  }
};

export type NameResult = { name: string; code?: CodeRename };
export const getName = <T>(objs: T[], maxLength: number): NameResult => {
  // should not throw here
  const descs: string[] = [];
  const merged = merge(objs);
  const desc = merged.desc;
  const flatDesc = merged.flatDesc;
  let code: CodeRename | undefined = undefined;

  if (hasFunction(merged) && !desc && !flatDesc) {
    code = CODE_RENAME.nameHasFunctions;
  }

  const name = (obj: any, flatDesc: string, desc: any) => {
    if (!flatDesc && !desc) {
      delete obj.desc;
      return getNameInt(obj);
    }

    return flatDesc || (typeof desc === 'function' ? desc(obj) : desc);
  };

  const fullName = name(merged, flatDesc, desc);

  objs.forEach(obj => {
    const untypedObj = { ...(obj as any) };
    const descOne = untypedObj.desc;
    if (descOne) {
      descs.push(typeof descOne === 'function' ? descOne(untypedObj) : descOne);
    }
  });

  const mergedDesc =
    flatDesc ||
    (descs.length > 0 && descs.every(p => !!p) ? descs.join(' ') : descs[0]) ||
    fullName;

  if (mergedDesc.length > maxLength) {
    code = CODE_RENAME.nameTooLong;
  }

  return { name: mergedDesc, code };
};

const getNameInt = (obj: any): string => {
  let allowedToReplaceNull = true;
  if (JSON.stringify(obj).includes('null')) {
    allowedToReplaceNull = false;
  }

  let result = JSON.stringify(obj, (k, v) => {
    if (typeof v === 'function') {
      return 'function';
    }
    if (v === undefined) {
      return null;
    }
    return v;
  });
  result = result
    .replace(/^\{(.*)\}$/, '$1')
    .replace(/"([\w\d]+)":/g, '$1: ') // prop names
    .replace(/:\s*"([\d\w]+)"/g, ': $1')
    .replace(/(,|{)/g, '$1 ')
    .replace(/}/g, ' }')
    .replace(/{\s*}/g, '{}')
    .replace(/"/g, `'`);

  if (allowedToReplaceNull) {
    result = result.replace('null', 'undefined');
  }

  // todo fix array [{...}]
  /*const template = /\[{([^}]*)}(,\s*{([^}]*)})*\]/g;
  const match = template.exec(result);
  if(match && match.length>0){
    
    const p =  match.slice(1).join(', ');
    return p;
  }*/
  return result;
};

export const hasFunction = (obj: any): boolean => {
  let hasFunction = false;
  JSON.stringify(obj, (k, v) => (typeof v === 'function' ? (hasFunction = true) : v));
  return hasFunction;
};
