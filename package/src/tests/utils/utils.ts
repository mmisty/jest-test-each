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

export async function delay(ms: number, ...messages: string[]) {
  console.log(...messages, messages.length > 0 ? ':' : '', `DELAY ${ms.toString()} ms`);
  await new Promise(resolve => setTimeout(resolve, ms));
}

export function success() {
  expect(1).toBe(1);
}
export function failure() {
  expect(1).toBe(0);
}
