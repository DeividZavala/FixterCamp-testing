<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# ¿Por qué Create React App?

Una de las ventajas que podemos encontrar en una aplicación hecha con Create React App (CRA) es que nos brinda un proyecto con la estructura y las herramientas necesarias para empezar a trabajar. Además de que cuenta con los recursos adecuados para poder testear nuestra aplicación y tener certeza de que lo que vamos a construir funciona correctamente.

Para crear un proyecto con el CRA:

```bash
$ npx create-react-app miproyecto
```

### Explorando un test con `react-testing-library`

Una vez que tenemos nuestra aplicación podemos darnos cuenta que CRA nos crea varios archivos entre los que se encuentran un componente principal y otro más que será en el que nos estaremos centrando en este momento, un archivo de test llamado `App.test.js`, vamos a revisarlo.

- Código

```js
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

En este bloque podemos ver un test básico que comienza haciendo las importaciones necesarias para que funcione.

- Importa `React` ya que estaremos trabajando con JSX en este archivo así que `React` tiene que estar en contexto.

- Importa `render` de `@testing-library/react`, un método que nos permite montar el componente en un "DOM" de una forma muy similar a lo que pasaría en el navegador.

- Importa el componente a Testear

Una vez hechas las importaciones, tenemos la prueba propiamente. Nos encontramos un bloque `test` donde tendremos la descripción que nos indica qué es lo que estamos probando y una función con la lógica para hacer dicha comprobación.

- La primer línea que podemos observar:

```js
const { getByText } = render(<App />);
```

Indica que vamos a montar el componente en un "DOM" virtual muy similar a lo que pasa en el navegador, este método nos devuelve un objeto del cual podemos sacar otros métodos para hacer queries o busquedas de nodos en nuestro componente, en este caso usamos `getByText`.

- La segunda linea:

```js
const linkElement = getByText(/learn react/i);
```

Nos permite buscar un elemento que, como el nombre del método indica, coincida con el `texto` que le estamos mandando, en este caso estamos usando un patrón de expresión regular muy simple, sin embargo, podríamos consultar pasando el texto tal como lo queremos entre comillas, `"Learn React"`, esto nos devolverá un nodo si encuentra una coincidencia.

¿Cúal es la diferencia entre hacer con una expresión regular y hacerlo con comillas?, muy simple, el query hecho con expresión regular tal cual tenemos en este test nos va a buscar coincidencias totales o parciales, sin importar si hay mayusculas, minusculas u otras palabras, mientras que hacerlo con comillas buscaremos un elemento que coincida exactamente con la cadena de texto que mandemos, debe tener las mayusculas y minusculas tal cual, además de ser estrictamente esa cadena que estamos buscando sin palabras o caracteres extra.

- La tercera linea:

```js
expect(linkElement).toBeInTheDocument();
```

Esta línea es donde podemos encontrar la aseveración que nos interesa comprobar, en este caso estamos buscando asegurar que el elemento que buscamos esté presente en el DOM esto lo hacemos con un matcher llamado `toBeInTheDocument`.

### Ejecutando nuestra pruebas

El comando lo podemos encontrar en el package.json:

```json
{
  "scripts": {
    "test": "react-scripts test"
  }
}
```

Y para ejecutarlo basta con ir a nuestra terminal y ejecutar:

```bash
$ yarn test
```
