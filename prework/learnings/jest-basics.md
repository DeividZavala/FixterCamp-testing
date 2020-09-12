<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Básicos de jest

En esta lección nos centraremos en explicar los básicos de jest, cubriremos las funciones `describe`, `test` e `it` así como los `matchers` básicos que podemos encontrar en jest.

Lo primero que tenemos que entender en esta lección es como se estructuran las pruebas, tenemos 3 funciones disponibles para ello.

- `describe`: Esta función nos permite agrupar todos los tests que pertenezcan a una función, módulo o componente para hacer más sencilla la lectura de las pruebas.

- `test/it`: Estas funciones muchas veces nos hacen pensar que son diferentes entre si y que por ende tienen comportamiento diferente, sin embargo, no es así, ambas funciones son usadas para expresar cada una de las pruebas que queremos hacer a nuestro código, la única diferencia radica en la semantica que cada una pueda aportar en conjunto con nuestra descripción del test.

```javascript
it("should render text");

test("text was rendered correctly");
```

como podemos ver en este ejemplo, ambas buscan indicar si un texto fue dibujado o no, lo único que cambia es la descripción del test.
En otras palabras puedes usar la que prefieras o la que tu equipo de desarrollo defina como estandar.

Una vez dicho esto, vamos a explicar por último que es lo que tengo que pasarle a cada una de estas funciones, las 3 reciben los mismos 2 parametros base, el `primero es un string describiendo el contenido o la prueba a realizar`, el `el segundo es una función` que contendra el código a ejecutar.

Así de simple.

# Código Terminado

```javascript
// app.test.js

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
```
