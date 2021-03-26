<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testing custom hooks con react-hooks-testing-library

A partir de la versión `16.8` de react, tuvimos una nueva funcionalidad que nos permite escribir código de una forma mucho más facil, los `Hooks`.

Con un bloque que forma parte de nuestro código, los `hooks` deben ser testeados, sin embargo, esto a veces puede ser un tanto complicado ya que para hacer los test es necesario que los hooks esten montados en un componente, de lo contrario tendremos el siguinete error:

> Invariant Violation: Hooks can only be called inside the body of a function component.

La gran mayoria del tiempo realmente no quieres escribir un componente únicamente para probar el `hook` y tener que resolver cómo ibas a disparar/detonar todas las diversas maneras en que el `hook` puede ser actualizado, especialmente si la integración tiene un nivel de complejidad alto.

La libreria `react-hooks-testing-library` te permite crear un entorno de pruebas simple para los `hooks` de React que se encarga de ejecutarlos dentro del cuerpo de un componente de función, además de proporcionar varias funciones útiles para actualizar las entradas y recuperar las salidas de tu hook personalizado. Esta librería tiene como objetivo proporcionar una experiencia de prueba lo más cercana posible al uso nativo de tu hook desde dentro de un componente real.

Usando esta librería, no tienes que preocuparte de cómo construir, renderizar o interactuar con el componente react para probar tu hook. Sólo tienes que utilizar el gancho directamente y afirmar los resultados.

Sin embargo, hay que considerar que esta librearia no es necesaria en todos los casos, hay 2 en particular en los cuales usar esta librearia es una buena idea.

### Cuando usar la libreria

- Está escribiendo una biblioteca con uno o más `hooks` personalizados que no están directamente vinculados a un componente.
- Tienes un `hooks` complejo que es difícil de probar a través de las interacciones de los componentes.

## Instalación

```bash
$ npm install --save-dev @testing-library/react-hooks

$ yarn add @testing-library/react-hooks -D
```

## Test

Para nuestra prueba, vamos a testear un `hook` simple pero que servirá para ejemplificar el uso de la libreria.

```js
import { useState } from "react";

const useQueue = () => {
  const [state, set] = useState([]);

  return {
    add: (value) => {
      set((queue) => [...queue, value]);
    },
    remove: () => {
      let result;
      set(([first, ...rest]) => {
        result = first;
        return rest;
      });
      return result;
    },
    first: () => {
      return state[0];
    },
    last: () => {
      return state[state.length - 1];
    },
    size: () => {
      return state.length;
    },
  };
};

export default useQueue;
```

Es un Hook simple que nos permite manipular una lista y nos expone 5 métodos.

- add: añade elementos a la lista
- remove: quita el primer elemento de la lista
- first: regresa el primer elemento de la lista
- last: regresa el ultimo elemento de la lista
- size: regresa el `lenght` de la lista

Empezaremos nuestras pruebas en el archivo `useQueue.test.js` donde haremos las importaciones necesaria y el bloque `describe` y `test` correspondiente.

```js
import { renderHook } from "@testing-library/react-hooks";
import useQueue from "../useQueue";

describe("useQueue", () => {
  test("useQueue hook methods", () => {});
});
```

Una vez listas las importaciones es importante notar `renderHooks` el método que nos va a permitir montar el `hook` para ser testeado, para usarlo es necesario pasarle como argumento un callback en el cual usemos el `hook` a testear, esta operación nos dará como resultado un objeto con 2 propiedades, `{ current, error }`, dentro de la propiedad current es donde estará el resultado que obtenemos de ejecutar el hook en sí, es decir, en nuestro caso el objeto con los métodos de `{ add, remove, first, last, size }`.

Una vez disponible la propiedad current podremos hacer la primera comprobación, el estao original de nuestro `hook` o dicho en otras palabras que el `size` del arreglo es 0.

```js
import { renderHook } from "@testing-library/react-hooks";
import useQueue from "../useQueue";

describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);
  });
});
```

Para hacer la ejecución de los otros métodos debemos de importar un nuevo utilitario que nos expone la libreria, `act`. Este utilitario permite ejecutar los métodos del hook los más acercado a como lo harian en el navegador.

```js
describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);

    act(() => result.current.add("test"));
  });
});
```

Como podemos ver es muy simple, `act` recibe un callback donde ejecutaremos el método del hook que nos interese, de esta forma podremos hacer un cambio en el estado del hook y comprobar el estado.

```js
describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);

    act(() => result.current.add("test"));

    expect(result.current.size()).toBe(1);
    expect(result.current.first()).toBe("test");
  });
});
```

Para probar los otros métodos del hook, el princio es el mismo:

```js
describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);

    act(() => result.current.add("test"));

    expect(result.current.size()).toBe(1);
    expect(result.current.first()).toBe("test");

    act(() => result.current.remove());

    expect(result.current.size()).toBe(0);

    act(() => {
      result.current.add(1);
      result.current.add(2);
    });

    expect(result.current.size()).toBe(2);
    expect(result.current.last()).toBe(2);
  });
});
```

## Código completo

```js
import { renderHook, act } from "@testing-library/react-hooks";
import useQueue from "../useQueue";

describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);

    act(() => result.current.add("test"));

    expect(result.current.size()).toBe(1);
    expect(result.current.first()).toBe("test");

    act(() => result.current.remove());

    expect(result.current.size()).toBe(0);

    act(() => {
      result.current.add(1);
      result.current.add(2);
    });

    expect(result.current.size()).toBe(2);
    expect(result.current.last()).toBe(2);
  });
});
```
