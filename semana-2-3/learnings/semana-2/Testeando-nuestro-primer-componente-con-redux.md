<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testeando nuestro primer componente con redux parte 1

Siguiendo con los temas del curso, en esta lección nos centraremos en seguir preparando nuestro entorno para poder empezar a con las pruebas en nuestra aplicación con redux.

Trabajaremos en el archivo `App.test.js`, para darnos una idea de qué es lo que necesitamos, en este archivo vamos crear una prueba donde intentaremos hacer el render de nuestro componente `App`.

```js
// App.test.js
import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

describe('<App /> component', () => {
  test('Render correctly', () => {
    const component = render(<App />)
  });
}
```

Este test funcionaría en caso de tener un componente simple, sin embargo, nuestro componente usa `Redux`, lo que significa que debemos crear un entorno donde le proporcionemos un lo necesario al componente, en este caso, el `Provider`.

Para esto, crearemos una carpeta llamada `jest` dentro de la carpeta raíz del proyecto y dentro de ella un archivo `utils.js`, es importante aclarar que este archivo solamente contiene utils de los tests.

```js
.
└── src /
    └── jest/
        └── utils.js
```

Dentro de este archivo, escribiremos un componente que se va a encargar de montar nuestros componentes dentro de un `Provider`.

```js
// App.test.js
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

export const renderWithProvider = (component, { store, ...renderOptions }) => {
  return render(<Provider store={store}>{component}</Provider>, {
    ...renderOptions,
  });
};
```

Hacemos la importaciones necesarias y escribimos el utilitario, recibirá 2 parametros, el `componente` y un objeto `{ store, ...renderOptions }`, lo importante de este objeto es el store, ya que ahí es donde tendremos la información que nuestro componente va a usar.

Ahora haremos los cambios pertinentes en el archivo `App.test.js`.

```js
// App.test.js
import React from 'react';
import { renderWithProvider } from '../jest/utils'; // cambiamos la importación
import App from '../App';

describe('<App /> component', () => {
  test('Render correctly', () => {
    const component = renderWithProvider(<App />) // cambiamos el método
  });
}
```

### Instalando redux-mock-store

Ahora solamente hace falta agregar el store con la información necesaria, para este propósito usaremos una librería que nos permite hacer un `mock` del store, el nombre del paquete es `redux-mock-store`.

```bash
$ npm install redux-mock-store --save-dev

$ yarn add redux-mock-store --dev
```

La ventaja de usar este paquete es que permite manejar y crear un store a partir de información que nosotros queramos, además de permitirnos detectar cuántas y cuaáles son las acciones que se despacharon en la aplicación.

Para usarlo es necesario hacer la importación y después crearemos una constante `mockStore` que contenga el resultado de ejecutar el módulo y dentro de nuestra prueba crearemos una constante llamada `store` y es ahí mismo donde agregaremos la información que nuestro componente necesita o dicho en otras palabras el `initialState` de nuestro componente:

```js
// App.test.js
import React from "react";
import { renderWithProvider } from "../jest/utils";
import App from "../App";
import createMockStore from "redux-mock-store";

const mockStore = createMockStore(); // ejecutamos el módulo

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore({ products: { data: [] }, cart: { data:[] }}) // creamos el store y agregamos data
    const component = renderWithProvider(<App />, { store }); // agregamos el store
  });
}
```

Ahora al correr los tests podremos observar que el error que veíamos anteriormente ya no aparece, sin embargo, nos enfrentamos a otro reto, el problema es que ahora tenemos un error en el dispatch.

```js
// App.js
useEffect(() => {
  if (status === "") dispatch(getProducts());
  if (status === "") dispatch(getCart());
}, [dispatch]);
```

La razón es que a pesar de tener configurado el provider, estamos usando acciones asíncronas, especificamente, `thunk` lo que significa es debemos darle la posibilidad a nuestro entorno de manejar este tipo de acciones, lo que haremos es importar el `middleware` de `redux-thunk` y pasarlo dentro de un arreglo al módulo `createMockStore`.

```js
// App.test.js
import React from "react";
import { renderWithProvider } from "../jest/utils";
import App from "../App";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk"; // importamos redux-thunk

const mockStore = createMockStore([thunk]); // pasamos el arreglo de middlewares

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore({ products: { data: [] }, cart: { data:[] }})
    const component = renderWithProvider(<App />, { store });
  });
}
```

En este caso solamente usamos `thunk` sin embargo si nuestra aplicación usara más middlewares basta con agregarlos a este arreglo y listo.

## Código final

```js
// App.test.js
import React from "react";
import { renderWithProvider } from "../jest/utils";
import App from "../App";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const mockStore = createMockStore([thunk]);

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore({ products: { data: [] }, cart: { data:[] }})
    const component = renderWithProvider(<App />, { store });
  });
}
```
