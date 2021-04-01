export const guard = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error('From guard: ' + message);
  }
};

export const assertAll = (...assertions: (() => void)[]) => {
  const errors: Error[] = [];
  const error = new Error(); // to remember stack
  for (const assertion of assertions) {
    const functionName2 = assertion.toString().replace(/}/gm, '');
    const functionName = functionName2.substr(functionName2.indexOf('expect'));
    try {
      // console.log(functionName);
      assertion();
    } catch (e) {
      e.message = functionName + '\n' + e.message;
      errors.push(e);
    }
  }

  if (errors.length === 1) {
    throw errors[0];
  }

  if (errors.length > 0) {
    error.message = `${errors.length} errors from ${assertions.length} checks\n\n`;
    error.message += errors
      .map((e, i) => `${i + 1}/${errors.length}: ${e.message}`)
      .join('\n\n ===== \n');
    throw error;
  }
};
