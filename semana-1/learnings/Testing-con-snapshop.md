<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testing con snapshots

Las pruebas de snapshots son una herramienta muy útil para asegurarse de que la interfaz de usuario no cambia de forma inesperada.

Un caso típico de prueba de snapshots es renderizar un componente de la interfaz de usuario, toma un snapshot o instantánea y la compara con un archivo de snapshots de referencia almacenado junto a la prueba. La prueba fallará si los dos snapshots no coinciden: o bien el cambio es inesperado, o el snapshot de referencia necesita ser actualizada a la nueva versión del componente de la interfaz de usuario.

Para poder lograr esto lo primero que haremos es usar una librería que nos va a permitir montar nuestro componente sin la necesidad de un DOM virtual, `react-test-renderer`.

## React test renderer

Este paquete proporciona un renderizador React que puede utilizarse para mostrar componentes React en objetos JavaScript puros sin depender del DOM o de un entorno móvil nativo.

Esencialmente, este paquete facilita la obtención de una instantánea de la jerarquía de la vista de la plataforma (similar a un árbol DOM) renderizada por un componente React DOM o React Native sin utilizar un navegador o jsdom.

### Instalación

```bash
$ npm i react-test-renderer
ó
$ yarn add react-test-renderer
```

### Test

Para nuestra prueba vamos a tomar el componente que testeamos anteriormente en el archivo `App.test.js`, un componente simple que permite agregar elementos a una lista.

Primero haremos la importación que necesitamos para usar la librería.

```js
import renderer from "react-test-renderer";
```

Con las importaciones listas lo primero que haremos es crear un nuevo bloque `describe` y dos bloques `it` para nuestras pruebas las cuales serán comprobar cómo se ve el componente con y sin información en el prop de `data`.

```js
describe("<App /> snapshot", () => {
  it("<App /> should match snapshot when data", () => {});
  it("<App /> should match snapshot if no data", () => {});
});
```

Dentro del primer test agregaremos este código:

```js
it("<App /> should match snapshot when data", () => {
  const data = ["test", "test 2"];
  const result = renderer.create(<App data={data} />).toJSON();
  expect(result).toMatchSnapshot();
});
```

Lo importante a notar en este código es `renderer.create(<App data={data} />).toJSON();` ya que esta línea es donde podemos obtener un objeto puro de js partiendo de nuestro componente de React con el método `toJSON` que posteriormente nos servirá para compararlo con el snapshot.

La siguiente línea es donde hacemos la comprobación del snapshot, esto lo haremos con un `matcher` de jest llamado `toMatchSnapshot`. La primera vez que ejecutemos los tests, jest creará una carpeta llamada `__snapshots__` y un archivo `App.test.js.snap` donde estarán los snapshots. Este archivo se ve de la siguiente forma:

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`<App /> snapshot <App /> should match snapshot if no data 1`] = `
<div
  className="App"
>
  <h1>
    Sin elementos para mostrar
  </h1>
  <div>
    <input
      placeholder="Ingresa el texto"
    />
    <button
      onClick={[Function]}
    >
      agregar
    </button>
  </div>
</div>
`;

exports[`<App /> snapshot <App /> should match snapshot when data 1`] = `
<div
  className="App"
>
  <ul>
    <li>
      test
    </li>
    <li>
      test 2
    </li>
  </ul>
  <div>
    <input
      placeholder="Ingresa el texto"
    />
    <button
      onClick={[Function]}
    >
      agregar
    </button>
  </div>
</div>
`;
```

Jest hará la comparación del snapshot tomado contra el resultado del `renderer`, si todo coincide nuestro test pasará, de lo contrario tendremos un error y tendremos que decidir si hay que actualizar el snapshot o cometimos un error.

Nuestra segunda prueba es muy similar a la anterior con la simple diferencia de que en este test no mandaremos información en el prop de `data`

```js
it("<App /> should match snapshot if no data", () => {
  const result = renderer.create(<App />).toJSON();
  expect(result).toMatchSnapshot();
});
```

Eso es todo, con esto podremos hacer nuestras pruebas de snapshot.

Al final, nuestro bloque completo, se ve de esta forma

```js
describe("<App /> snapshot", () => {
  it("<App /> should match snapshot when data", () => {
    const data = ["test", "test 2"];
    const result = renderer.create(<App data={data} />).toJSON();
    expect(result).toMatchSnapshot();
  });
  it("<App /> should match snapshot if no data", () => {
    const result = renderer.create(<App />).toJSON();
    expect(result).toMatchSnapshot();
  });
});
```
