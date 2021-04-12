<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testing reducers

Es momento de testear la última pieza de nuestro archivo,el reducer, este es en mi opinión una de las piezas más fáciles de testear, el principio es muy simple, usaremos nuestros `action creators`, basta con crear nuestros objetos de acción y pasarlos al reducer para poder validar el comportamiento y si estamos obteniendo la información que buscamos.

Vamos a trabajar en el mismo archivo de `productsDuck.test.js` donde tenemos los tests de los actios creators y thunks. Para empezar crearemos un bloque `describe` para separar nuestras pruebas.

```js
describe("Products reducer", () => {});
```

Nuestra primera prueba estará orientada a que probemos el comportamiento de nuestro reducer cuando no recibe una acción o si por alguna razón recibe una acción que no esta contemplada en el reducer, es decir, el default que definimos en el `switch`.

Pero primero necesitamos crear un utilitario que nos permita crear y módificar un objeto con la estrucura igual a la que usa el reducer con el fin de examinar el cambio de estado.

```js
const buildState = (changes = {}) => ({
  status: "",
  data: {},
  ...changes,
});
```

Tenemos una función simple que recibe un objeto con los cambios que necesitemos, por defecto la función devolvera un objeto de la forma `{status: "", data:{}}` que nos permitirá crear las primeras pruebas.

Dentro de la primera prueba vamos a ejecutar el reducer y almacenar el resultado en una constante `result` e inmediatamente después haremos nuestra comprobación donde compararemos `result` con el resultado de `buildState`.

Nuestro primer test queda de la siguiente forma:

```js
describe("Products reducer", () => {
  test("reducer return default state if no action", () => {
    const result = reducer();
    expect(result).toEqual(buildState());

    const result2 = reducer(buildState({ status: "fetching" }));
    expect(result2).toEqual(buildState({ status: "fetching" }));
  });
});
```

Como puedes notar es un test simple pero que nos permite comprobar exactamente lo que buscamos, que el reducer devulva el initialState como resultado.

Nuestra segunda prueba es similar, solo que esta vez probaremos la acción de `fetchProducts` la cual debe de tener un comportamiento donde el status sea `fetching`.

```js
test("reducer handle fetch products action", () => {
  const action = fetchProducts();
  const result = reducer(undefined, action);
  expect(result).toEqual(buildState({ status: "fetching" }));
});
```

En esta ocasion tenemos una constante `action` donde tenemos el objeto resultante de ejecutar el action creator de `fetchProducts`, lo que haremos ahora es simplemente pasar el action al reducer y listo, el resto es el mismo proceso que hicimos en el test anterior, comprobar que efectivamente tengamos un estado resultante con la misma data.

Nuestro siguiente par de pruebas son un tanto mas interesantes debido a que ahora debemos de intereactuar un poco más con los action creators, la tercera prueba que haremos es testear el caso de éxito, es decir, cuando la petición es éxitosa.

```js
import { normalizeData } from "../../utils"; // importamos el normalize data

test("reducer handle fetch products action success", () => {
  const action = fetchProductsSuccess([
    {
      id: 1,
      name: "XBSX Call of Duty Black Ops: Cold War - Standard",
      price: "1619.00",
      image:
        "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
    },
  ]);
  const result = reducer(undefined, action);
  expect(result).toEqual(
    buildState({
      status: "finished",
      data: normalizeData([
        {
          id: 1,
          name: "XBSX Call of Duty Black Ops: Cold War - Standard",
          price: "1619.00",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
        },
      ]),
    })
  );
});
```

Como podemos ver, ahora el action creator recibe un arreglo de objetos que es exactamente como recibiremos la información al completarse el thunk, otra cosa a notar es que estamos usando `normalizeData`, un `util` que nos permite convertir ese arreglo de objetos en un objeto de objetos para poder manipular más fácil la información.

Por último la prueba que nos hace falta es para probar el caso de error.

```js
test("reducer handle fetch products action error", () => {
  const action = fetchProductsError();
  const result = reducer(undefined, action);
  expect(result).toEqual(
    buildState({ status: "error", error: "Algo salió mal" })
  );
});
```

Como podemos ver esta vez lo único que hacemos es comprobar que el status sea correcto y que ahora tengamos una nueva llave en el estado llamada `error` donde tendremos el mensaje de error que configuramos.

## Código final

```js
// productsDuck.test.js

...

describe('Products reducer', () => {
  test('reducer return default state if no action', () => {
    const result = reducer();
    expect(result).toEqual(buildState());

    const result2 = reducer(buildState({ status: 'fetching' }));
    expect(result2).toEqual(buildState({ status: 'fetching' }));
  });

  test('reducer handle fetch products action', () => {
    const action = fetchProducts();
    const result = reducer(undefined, action);
    expect(result).toEqual(buildState({ status: 'fetching' }));
  });

  test('reducer handle fetch products action success', () => {
    const action = fetchProductsSuccess([
      {
        id: 1,
        name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
        price: '1619.00',
        image:
          'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
      },
    ]);
    const result = reducer(undefined, action);
    expect(result).toEqual(
      buildState({
        status: 'finished',
        data: normalizeData([
          {
            id: 1,
            name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
            price: '1619.00',
            image:
              'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
          },
        ]),
      }),
    );
  });

  test('reducer handle fetch products action error', () => {
    const action = fetchProductsError();
    const result = reducer(undefined, action);
    expect(result).toEqual(buildState({ status: 'error', error: 'Algo salió mal' }));
  });
});
```
