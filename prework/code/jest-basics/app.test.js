function calculator({ a, b, operation } = {}) {
  if (!a || !b) return "datos faltantes";
  switch (operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      return a + b;
  }
}

describe("testing calculator", () => {
  test("sum operation", () => {
    const result = calculator({ a: 2, b: 2, operation: "+" });
    expect(result).toBe(4);
  });
  test("subtract operation", () => {
    const result = calculator({ a: 2, b: 2, operation: "-" });
    expect(result).toBe(0);
  });
  test("default", () => {
    const result = calculator({ a: 2, b: 2 });
    expect(result).toBe(4);
  });
  test("return error message if no values", () => {
    const result = calculator({ a: 2 });
    expect(result).toBe("datos faltantes");
  });
});
