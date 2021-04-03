export const calc = (a: number, b: number, sign: "+" | "-" | "*" | "/") => {
  switch (sign) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      throw new Error("Unknown sign");
  }
};

export async function delay(ms: number, ...messages: string[]) {
  /*console.log(
    ...messages,
    messages.length > 0 ? ":" : "",
    `DELAY ${ms.toString()} ms`
  );*/
  await new Promise((resolve) => setTimeout(resolve, ms));
}
