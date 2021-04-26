<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Mock Avanzado: Peticiones http con msw.js

Cuando hablamos de hacer tests en nuestras aplicaciones, uno de los temas principales que tenemos que tener en mente es cómo debemos lidiar con las peticiones que nuestra aplicación hace al servidor, ya que prácticamente todas las aplicaciones tiene interacción de alguna manera con peticiones.
Para muchos, este proceso puede sonar familiar e incluso simple. Si es que ya tienes experiencia con esta parte, quizá lo primero que se viene a tu mente es simplemente crear un mock con jest, algo como esto (axios):

```js
// __mocks__/axios.js

export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  // ...
}

// how it can be implemented in our tests

import mockAxios from "axios"

test("a simple test", () => {
  ...
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: {} }))
  ...
})
```

Sin embargo, puede que no sea la mejor solución o por lo menos la que represente la mas robusta, ¿a que me refiero con esto?
Cuando hacemos un mock de alguna librería como axios, estamos infiriendo que la petición fue hecha correctamente, es decir, que si nuestra petición requería mandar ciertas cabeceras, por ejemplo, éstas fueron mandadas correctamente cuando quizá no fue así y, ya que nuestra prueba probablemente no esté enfocada en asegurarse de que esas cabeceras hayan sido enviadas, corremos el riesgo de dejar pasar un error.

Por otra parte, ésta no es la única complejidad que se nos puede presentar con este acercamiento, como muchos saben, otra de las necesidades que la forma planteada anteriormente requiere, es repetir código para que cada tests pueda tener la implementación y respuesta que necesitamos. Cosa que puede resultar en archivos muy grandes y difíciles de matener.

## La alternativa… msw.js

msw son las siglas de Mock Service Worker, una herramienta que se encarga de interceptar todas las peticiones que se hacen a nivel de tu red. Expliquemos un poco más a detalle de qué va esto.

La idea básica de msw es crear un servidor falso que intercepte todas las peticiones y manejarlas como si fuera un servidor real. Lo que implica que puedes implementar esta herramienta en conjunto de “base de datos” ya sea de archivos json para “sembrar” los datos, o “constructores” como fakerJS y posteriormente crear controladores (similares al API express) e interactuar con esa base de datos simulada. Esto hace que podamos probar nuestra aplicación en condiciones muy similares a las que hay en producción, ya sea para desarrollo, testing o debugging. En el caso de pruebas que es en lo que nos centraremos hoy, permite que los tests sean rápidos y fáciles de escribir.

Una vez explicado todo esto, podemos pasar a escribir código ❤
Lo que haremos en esta ocasión es una demo muy simple de como trabajar con msw, tomaremos como base una aplicación de ToDos muy básica hecha con create-react-app y explorando los test con jest y react-testing-library.

## Código Base

```js
// App.js

import React, { useEffect, useState } from "react";
// considering we have the service created
import { getTodos } from "./services/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    getTodos()
      .then((res) => {
        const { data: todos } = res;
        setTodos(todos);
      })
      .catch((err) => {
        setError(err?.response?.data?.message);
      });
  }, []);

  return (
    <div className="App">
      {error && <h1>{error}</h1>}
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo.body}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

```js
// services/todos.js

import axios from "axios";

axios.defaults.withCredentials = true;

export const getTodos = () => axios.get("http://localhost:4000/todos");
```

```js
// db.json

{
    "todos": [{ "id": 1, "body": "first todo" }]
}
```

## Empecemos con el código

Empezaremos con la instalación del paquete

```bash
yarn add msw -D
```

Una vez que tenemos el paquete instalado lo que vamos a hacer es crear una carpeta `jest` y dentro un archivo `server.js` donde nos encargaremos de poner la configuración base de `msw.js`.

```js
// jest/server.js

import { rest } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  rest.get("http://localhost:4000/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, body: "first todo" }]));
  }),
];

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

export { server, rest };
```

Como podemos ver en el código, creamos un archivo llamado server.js dentro de una carpeta llamada mocks, en ese archivo hicimos la importación de un objeto llamado rest proveniente de msw, ya que es la arquitectura que seguiremos, sin embargo, es importante resaltar que msw también te permite emular el flujo si trabajas con **GraphQL**.

Además de la importación, creamos una constante llamada handlers que contendrá todos los controladores que queramos incluir en nuetro “server”.

El objeto server contiene métodos correspondientes a los verbos http como get y post, la sintaxis es muy simple, al método únicamente es necesario pasarle 2 parametros, la url y un “resolver”que recibirá a su vez req, res y ctx las cuales explicaremos un poco a continuación:

- req, contiene información sobre la petición.

- res, un utilitario funcional que se encarga de mandar la respuesta.

- ctx, grupo de funciones que nos permiten configurar códigos de estado, cabeceras, cuerpo de la respuesta, entre otras cosas.

Para que msw pueda interceptar la petición es importante que coloquemos correctamente la url, hay 3 formas en los que msw
puede evaluar las coincidencias.

- Mediante la url exacta e.j. http://localhost:4000/todos
- Mediante el path /todos
- Mediante expresiones regulares

Puedes encontrar mas información al respecto aquí.
Genial, ahora que ya platicamos sobre como configurar nuestro servidor falso, es momento de pasar al siguiente paso, la configuración en jest para nuestras pruebas.

## Configuración de Jest

Para este paso, vamos a aprovechar las ventajas que nos brinda el crear una aplicación con el create-react-app ya que nos entrega un entorno completamene configurado con las herramientas que vamos a necesitar no sólo para poder desarrollar nuestro proyecto, sino también para poderlo testear correctamente.

Dentro de nuestro proyecto encontraremos un archivo llamado setupTests.js dentro de la carpeta src, es aquí donde podremos agregar configuración extra que nos sea útil en nuestros test, por ejemplo, por defecto viene importado el módulo “@testing-library/jest-dom/extend-expect” que nos permite usar afirmaciones como toBeInTheDocument o toHaveAttribute, es dentro de este archivo donde agregaremos lo siguiente:

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

/**************
 * MSW config code
 ***************/

import { server } from "./mocks/server";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
```

Como podemos ver, la configuración requerida es muy sencilla, basta con importar el server que acabamos de configurar y agregar tres condiciones globales para nuestras pruebas:

- beforeAll, levanta el “server” para que este a la espera de las peticiones antes de que empiecen a correr mis tests.

- afterEach, después de cada prueba va a resetear los controladores a los valores iniciales ya durante las pruebas podemos agregar nuevos controladores que no estaban definidos previamente, tema que cubriremos un poco más adelante, esto para evitar que eso nuevos controladores afecten a otras pruebas.

- afterAll, después de que todas la pruebas hayan concluido, terminamos el “servidor”.

Para este punto ya hemos cubierto todo lo que necesitamos para configurar msw en nuestro proyecto, pero ¿cómo lo implementamos?.

## Tests

Dentro de nuestro archivo de test llamado `App.test.js` vamos a escribir 2 pruebas que explicaremos paso a paso más adelante, la primer prueba consiste en asegurarnos que efectivamente obtengamos los TODOS de nuetra petición,el código de esa prueba es el siguiente:

```js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { server, rest } from "./mocks/server";
import App from "./App";

test("fetch todos and render", async () => {
  render(<App />);
  const items = await waitFor(() => screen.getAllByRole("listitem"));
  expect(items.length).toBe(1);
});
```

Ya estamos en la recta final, expliquemos un poco qué es todo este código que tenemos aquí. Primero que nada recordemos que vamos a usar testing-library para nuestros test, así que importamos render, screen y waitFor, la importación de react, está por demás que la expliquemos, importamos de igual manera “server” y “rest”, quizá se pregunten ¿para qué?, en un momento lo explicamos, por último el componente que vamos a probar en este caso App.

En nuestro primera prueba que denominamos fetch todos and render estamos probando que la petición se esté efectuando y nuestro componente la esté manejando correctamente, es aquí donde viene una de las primeras cosas que resulta interesante, recordemos que las peticiones son procesos asíncronos por lo que estos pueden demorar, es por esta razón que necesitamos hacer uso del método waitFor, ya que éste nos ayudará a que nuestro test espere a que se encuentre un elemento con el rol de listitem, una vez que se encuentra un elemento de ese tipo en el DOM, podemos proceder a realizar nuestras afirmaciones, en este caso sólo hicimos una simple, la respuesta de nuestro “servidor” falso nos regresaba una sola ToDo (definido en el controlador) porque la afirmación consiste en que el número de elementos que coincidan con el rol de listitem únicamente sea uno.

En este proceso que acabamos de explicar, nos centramos en la primera prueba que consiste en el caso éxitoso, en el que todo sale bien. Ahora veremos el otro caso, cuando queremos probar el caso de falla.

```js
test("fetch todos and render failed", async () => {
  server.use(
    rest.get("http://localhost:4000/todos", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: "http error" }));
    })
  );
  render(<App />);
  const error = await waitFor(() => screen.getByRole("heading"));
  expect(error).toBeInTheDocument();
  expect(error).toHaveTextContent("http error");
});
```

Como podemos ver el código es muy similar al de nuestra primer prueba a nivel de afirmaciones. Sin embargo, hay una diferencia, en nuestro segundo test estamos haciendo uso de nuevo del “server” y del objeto rest, esto con la intención de hacer que para ese test en especifico, la respuesta sea diferente, lo que estamos haciendo es indicando que la respuesta a la petición ahora tiene que ser una falla y por ende nuestro componente tiene que comportarse diferente y dibujar el mensaje “http error” que configuramos.

Es importante darnos cuenta que estanos siguiendo en la respuesta de la petición, la misma estructura que espera nuestro componente para manejar la respuesta, es decir un objeto con la llave `message`.

## Código Final

```js
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { server, rest } from "../jest/server";

test("<App/> renders and fetch todos", async () => {
  render(<App />);
  const items = await waitFor(() => screen.getAllByRole("listitem"));
  expect(items.length).toBe(1);
});

test("<App/> renders error", async () => {
  server.use(
    rest.get("http://localhost:4000/todos", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: "http error" }));
    })
  );
  render(<App />);
  const error = await waitFor(() => screen.getByRole("heading"));
  expect(error).toBeInTheDocument();
  expect(error).toHaveTextContent("http error");
});
```
