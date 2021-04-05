<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testing action creator y thunks

La siguiente pieza de código que vamos a testear en nuestro archivo donde tenemos la lógica correspondiente a redux, más especificamente los `action creators` y los `thunks`.

El archivo que vamos a testear es `productsDuck.js` y nos vamos a centrar en 2 bloques los `action creators` y los `thunks`.

Para empezar vamos a crear la estructura de carpetas y archivos que hemos usado hasta el momento, creando una carpeta `__tests__` dentro de la carpeta `redux` y un archivo `productsDuck.test.js` creado la estructura de la siguiente forma.

```
.
└── src/
    └── redux/
        └── __tests__/
            └── productDuck.test.js
```

Dentro de este archivo vamos a hacer la importación de nuestros `action creators`, thunks y el createMockStore dentro del archivo de los tests, ya con las importaciónes vamos a hacer la configuración de `MockStore` y nuestro bloque `describe` y `test`.

```js
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  getProducts,
  fetchProducts,
  fetchProductsError,
  fetchProductsSuccess,
} from "../productDuck";

const mockStore = createMockStore([thunk]);

describe("Products duck", () => {
  test("fetch products success", () => {
    const store = mockStore();
  });
});
```

## Primera Prueba thunk Success

La primera prueba que haremos es testear nuestro `thunk` en el caso de `éxito`, es decir, cuando nuestra petición funciona correctamente. Para poder testear nuestros thunks es importante tener presente qué es lo que hacen o cómo es que interactuamos con ellos en nuestra aplicación. ¿A qué me refiero con esto? en nuestro caso los thunks son los bloques donde hacemos peticiones de datos para nuestra aplicación, y los detonamos con el `dispatch` es aquí donde encontramos otro método muy útil de `redux-mock-store` ya que el store tiene un método `"dispatch"` que podemos usar de una forma igual al que redux nos proporciona, para el proceso vamos a convertir nuestra función del test en una función asíncrona y despacharemos el action que se encarga a su vez de detonar el thunk.

```js
describe("Products duck", () => {
  test("fetch products success", async () => {
    const store = mockStore();
    await store.dispatch(getProducts());
  });
});
```

Para comprobar que esto funciona como lo esperamos, el proceso que vamos a seguir es muy similar a uno que ya hemos hecho previamente, trackear las acciones que se detonan como resultado de este proceso, haremos uso de `store.getActions()` y ahora solamente nos queda crear las actions que esperamos con la respectiva data y hacer nuestras pruebas.

```js
const actions = store.getActions();
const expectedActions = [
  { type: FETCH_PRODUCTS },
  {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: [
      {
        id: 1,
        name: "XBSX Call of Duty Black Ops: Cold War - Standard",
        price: "1619.00",
        image:
          "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
      },
    ],
  },
];
expect(actions).toEqual(expectedActions);
```

Como podemos ver, aquí hicimos uso de los types que tenemos definidos en mi `duck` así que para poder hacer esto debemos hacer 2 cosas, `exportar` estos `action Types` de nuestro duck e importarlos en mi archivo de pruebas.

```js
// productDuck.js
...

export const FETCH_PRODUCTS = 'products/FETCH_PRODUCTS';
export const FETCH_PRODUCTS_SUCCESS = 'products/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_ERROR = 'products/FETCH_PRODUCTS_ERROR';

...
```

**Importaciones**

```js
// productDuck.test.js
...

import reducer, {
  getProducts,
  fetchProducts,
  fetchProductsError,
  fetchProductsSuccess,
  //action types
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
} from '../productDuck';

...
```

Ahora al correr nuestra prueba nos damos cuenta que todo funciona como lo esperamos.

## Segunda Prueba Thunk error

Para la segunda prueba ahora nos enfocaremos en probar el caso de error que podemos tener al recibir respuestas del servidor códigos de status de `500` o `400` y sus respectivas variantes.
Esta prueba tiene las mismas bases que la anterior por lo que podremos reutilizar una parte de nuestro código.

```js
test("fetch products error", async () => {
  const store = mockStore();
  await store.dispatch(getProducts());
  const actions = store.getActions();
});
```

A partir de aquí es donde viene los cambios con respecto a lo que tenemos anteriormente, en nuestro mock de axios que es el que jest esta usando para la petición, solamente estamos considerando el caso de éxito por que será necesario que hagamos un cambio en la implementación para poder hacer el caso de error. Tenemos que importar por supuesto nuestro `mockAxios` y para hacer el cambio usamos `mockImplementationOnce`.

```js
// productDuck.test.js
...
import mockAxios from "axios"

test("fetch products error", async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.reject({ response: { data: '500 server error' } }),
  );
  const store = mockStore();
  await store.dispatch(getProducts());
  const actions = store.getActions();
});
```

Debemos notar que usamos `Promise.reject` ya es es aquí donde tendremos el "fallo" de nuestro proceso.

Ahora nos queda hacer nuestras comprobaciones haciendo los cambios de action types.

```js
test("fetch products error", async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.reject({ response: { data: "500 server error" } })
  );
  const store = mockStore();
  await store.dispatch(getProducts());
  const actions = store.getActions();
  const expectedActions = [
    { type: FETCH_PRODUCTS },
    { type: FETCH_PRODUCTS_ERROR },
  ];
  expect(actions).toEqual(expectedActions);
});
```

## Código final

```js
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  getProducts,
  fetchProducts,
  fetchProductsError,
  fetchProductsSuccess,
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
} from "../productDuck";
import mockAxios from "axios";

const mockStore = createMockStore([thunk]);

describe("Products duck", () => {
  test("fetch products success", async () => {
    const store = mockStore();
    await store.dispatch(getProducts());
    const actions = store.getActions();
    const expectedActions = [
      { type: FETCH_PRODUCTS },
      {
        type: FETCH_PRODUCTS_SUCCESS,
        payload: [
          {
            id: 1,
            name: "XBSX Call of Duty Black Ops: Cold War - Standard",
            price: "1619.00",
            image:
              "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
          },
        ],
      },
    ];
    expect(actions).toEqual(expectedActions);
  });

  test("fetch products error", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({ response: { data: "500 server error" } })
    );
    const store = mockStore();
    await store.dispatch(getProducts());
    const actions = store.getActions();
    const expectedActions = [
      { type: FETCH_PRODUCTS },
      { type: FETCH_PRODUCTS_ERROR },
    ];
    expect(actions).toEqual(expectedActions);
  });
});
```
