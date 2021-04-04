<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Testeando nuestro primer componente con redux parte 2

En esta segunda parte lo primero que haremos es concentrarnos en mejorar las bases de lo que hemos creado hasta ahora y mejorar un poco más los utilitarios que tenemos para las pruebas.

Para ello crearemos una función que se llame `buildState` esta función nos va a permitir crear un estado para nuestras pruebas con las información que necesitemos.

```js
const buildState = (productsChanges, cartChanges) => ({
  products: { data: {}, ...productsChanges },
  cart: { data: {}, ...cartChanges },
});
```

Como podemos ver, esta función recibe 2 argumentos, estos serán los cambios o valores que necesitemos para llenar el `state` de nuestra prueba. Es importante señalar que estos argumentos son objetos y que deben cumplir o tener la misma forma que tiene nuestro `state` real o de producción.

Hasta este punto ya estamos listos para empezar con las pruebas, podríamos tomar los conceptos que hemos visto hasta el momento, empezar con el query que nos expone `@testing-library/react` y hacer las comprobaciones. Sin embargo, hay veces en las que hacer pruebas simples como saber si el componente se está dibujando correctamente, si estamos mostrando el `loader` o si estamos mostrando algún tipo de mensaje se vuelve un poco tedioso, es por ello que vamos a rescatar un concepto que hemos visto en módulos anteriores, los `snapshots`.

Para ello vamos a instalar la herramienta que necesitamos, `react-test-renderer`.

```bash
$ npm i react-test-renderer -D

$yarn add react-test-renderer -D
```

Una vez hecha la importación crearemos un nuevo `util` en `jest/utils.js`.

```js
// src/jest/utils.js
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer"; // importamos react-test-renderer

export const renderWithProvider = (component, { store, ...renderOptions }) => {
  return render(<Provider store={store}>{component}</Provider>, {
    ...renderOptions,
  });
};

// Nuevo util
export const renderWithProviderSnapshot = (
  component,
  { store, ...renderOptions }
) => {
  return renderer.create(<Provider store={store}>{component}</Provider>, {
    ...renderOptions,
  });
};
```

Como podemos observar la única diferencia con respecto al `util` que teníamos previamente es que estamos reemplazando `render` port `renderer.create`.

Ahora regresamos al archivo `__tests__/App.test.js` y sustituimos `renderWithProvider` por `renderWithProviderSnapshot` y agregaremos el comprobación de que el snapshot coincida.

```js
// App.test.js
import React from "react";
import { renderWithProvider, renderWithProviderSnapshot } from "../jest/utils";
import App from "../App";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const mockStore = createMockStore([thunk]);

const buildState = (productsChanges, cartChanges) => ({
  products: { data: {}, ...productsChanges },
  cart: { data: {}, ...cartChanges },
});

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore(buildState({ data: { 1: {} }}));
    const component = renderWithProviderSnapshot(<App />, { store });
    expect(component).toMatchSnapshot()
  });
}
```

Al correr estas pruebas vamos a tener un error que a grandes rasgos indica que hay que poner nuestro componente dentro de un `act`, este error ocurre porque se están despachando las acciones para hacer la petición de los datos, un `dispatch`. Para resolver esto, basta con hacer una condición para saber en qué momento es cuando debemos hacer una petición.

```js
// App.js
...

useEffect(() => {
  if (status === "") dispatch(getProducts());
  if (status === "") dispatch(getCart());
}, [dispatch]);
```

Por último, debemos de mandar la información correcta necesaria para que el componente muestre tanto los productos como el carrito.

```js
test("Render correctly", () => {
  const store = mockStore(
    buildState(
      {
        status: "finished",
        data: {
          1: {
            id: 1,
            name: "XBSX Call of Duty Black Ops: Cold War - Standard",
            price: "1619.00",
            image:
              "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
          },
        },
      },
      {
        data: {
          1: {
            id: 1,
            name: "XBSX Call of Duty Black Ops: Cold War - Standard",
            price: "1619.00",
            quantity: 2,
            image:
              "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
          },
        },
      }
    )
  );
  const component = renderWithProviderSnapshot(<App />, { store }).toJSON();
  expect(component).toMatchSnapshot();
});
```

Hecho esto, ahora nos centraremos en una prueba donde podamos intereactuar y detonar acciones como lo haría un usuario, para ello, la prueba que haremos será comprobar si podemos borrar un elemento del carrito, vamos a crear una prueba con practicamente las mismas bases de la anterior, tomando en cuenta que en esta prueba si usaremos `reanderWithProvider`.

Haremos un par de cambios más, el primero es fuera de nuestras pruebas, iremos al componente de item de carrito y en el `span` que contiene el ícono de basura y donde está el onClick agregaremos el `role` de `remove` después haremos la importación de `userEvent`.

Ya con las importaciones y cambios hechos, ahora escribiremos el código para detonar el click en el bóton con `role` de `remove` y haremos una comprobación para saber si nuestra acción de despacho correctamente.

Es importante entender que el proceso que estamos apunto de detonar puede ser un tanto más tardado que el tiempo de ejecución de nuestra prueba porque para asegurar que todo funcione correctamente haremos el test asíncrono agregando un `async-await`, donde el await estará en el `userEvent.click()`.

Para saber qué acciones se despacharon será necesario hacer uso de un método que tiene el store, `getActions()` este método nos devolverá un arreglo con todas las acciones que se despacharon durante el proceso, ahora solamente nos quedaría comprobar si efectivamente todo coincide con lo esperado.

El código se ve así:

```js
import userEvent from "@testing-library/user-event"

...

test("Delete product from cart", async () => {
  const store = mockStore(
    buildState(
      {},
      {
        data: {
          1: {
            id: 1,
            name: "XBSX Call of Duty Black Ops: Cold War - Standard",
            price: "1619.00",
            quantity: 2,
            image:
              "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
          },
        },
      }
    )
  );
  const { getByRole } = renderWithProvider(<App />, { store });
  const trash = getByRole("remove");
  await userEvent.click(trash);
  const actions = store.getActions();
  const expectedActions = [{ payload: undefined, type: 'cart/EDIT_CART' }];
  expect(actions).toEqual(expectedActions);
});
```

Como pueden ver, aquí tenemos un `undefined` en el `payload` de mi acción, esto se debe a que ese payload es el resultado que nos entrega la ejecución del `thunk` o dicho en otras palabras, la respuesta del servidor. A este punto podemos inferir que si queremos cambiar ese `undefined` tenemos que usar un `mock` que ya hemos hecho: `axios`, entonces tendremos que hacer la importación y modificar el resultado que tenemos predefinido en el `mock`.

```js
import mockAxios from 'axios';

...

mockAxios.patch.mockImplementationOnce(() => Promise.resolve({ data: { products: [] } }));
```

Lo que estamos haciendo es simplemente asegurar que devolvamos un valor diferente al `undefined`, hacemos el cambio y listo, podremos ver que todo funciona bien.

Al final aún hay muchas pruebas que podemos hacer y muy probablemente que debemos hacer, es cuestión de comprobar que efectivamente se esté haciendo la petición con ciertos valores, entre otras, sin embargo, con estas bases podemos ya empezar a hacer pruebas mucho más robustas.

## Código final

```js
import React from "react";
import { renderWithProvider, renderWithProviderSnapshot } from "../jest/utils";
import App from "../App";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";
import mockAxios from "axios";

const mockStore = createMockStore([thunk]);

const buildState = (productsChanges, cartChanges) => ({
  products: { data: {}, ...productsChanges },
  cart: { data: {}, ...cartChanges },
});

console.log(buildState({ data: { 1: {} } }));

describe("<App /> component", () => {
  test("Render correctly", () => {
    const store = mockStore(
      buildState(
        {
          status: "finished",
          data: {
            1: {
              id: 1,
              name: "XBSX Call of Duty Black Ops: Cold War - Standard",
              price: "1619.00",
              image:
                "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
            },
          },
        },
        {
          data: {
            1: {
              id: 1,
              name: "XBSX Call of Duty Black Ops: Cold War - Standard",
              price: "1619.00",
              quantity: 2,
              image:
                "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
            },
          },
        }
      )
    );
    const component = renderWithProviderSnapshot(<App />, { store }).toJSON();
    expect(component).toMatchSnapshot();
  });

  test("Delete product from cart", async () => {
    const store = mockStore(
      buildState(
        {},
        {
          data: {
            1: {
              id: 1,
              name: "XBSX Call of Duty Black Ops: Cold War - Standard",
              price: "1619.00",
              quantity: 2,
              image:
                "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
            },
          },
        }
      )
    );
    mockAxios.patch.mockImplementationOnce(() =>
      Promise.resolve({ data: { products: [] } })
    );
    const { getByRole } = renderWithProvider(<App />, { store });
    const trash = getByRole("remove");
    await userEvent.click(trash);
    const actions = store.getActions();
    const expectedActions = [{ payload: [], type: "cart/EDIT_CART" }];
    expect(actions).toEqual(expectedActions);
  });
});
```
