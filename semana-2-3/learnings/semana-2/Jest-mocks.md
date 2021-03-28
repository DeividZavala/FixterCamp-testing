<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Intro a Jest Mocks

Para entender los mocks primero debemos entender por qué son importantes, muchas veces cuando estamos probando nuestro código, encontramos que hay partes cuya complejidad para testear es muy grande gracias a la dependencia que hay con otros módulos, ya sea por que recibes información de ellos o por que ejecutan un proceso de forma independiente, la complejidad se presenta cuando no tienes todos los datos o información para que este proceso se ejecute satisfactoriamente o porque el tiempo requerido para completarlos es muy grande, es aquí cuando hacer un `mock` del módulo cobra sentido.

Las funciones `mock` permiten probar los vínculos entre el código borrando la implementación real de una función, capturando las llamadas a la función (y los parámetros pasados en esas llamadas), capturando las instancias de las funciones constructoras cuando se crea una instancia con `new`, y permitiendo la configuración en tiempo de prueba de los valores de retorno.

Hay dos maneras de simular funciones: creando una función simulada para usarla en el código de prueba, o escribiendo una simulación manual para anular una dependencia del módulo.

## Primeros pasos

Para ejemplificar esto lo más importante a entender es que los mocks nos van a permitir sustituir módulos y remplazarlos con la lógica que nos permita hacer más simples nuestras pruebas. para empezar crearemos 2 carpetas `__tests__` y `__mocks__` dentro de la carpeta `src`, de las 2 la carpeta de `__mocks__` es la mas importante ya que es ahí donde pondremos el código con el que remplazaremos nuestro módulo, vamos a remplazar las funciones que tenemos en el archivo `utils.js`.

```js
// src/utils.js
export const normalizeData = (data) =>
  data.reduce((acc, todo) => ({ ...acc, [todo.id]: todo }), {});

export const denormalizeData = (data) => Object.values(data);
```

Lo primero que haremos es crear un archivo con exactamente el mismo nombre del archivo donde tenemos el código a reemplazar, es decir, `utils.js`, quedando la estructura siguiente:

```
.
└── src /
    └── __mocks__/
        └── utils.js
```

Una vez listo el archivo escribiremos dentro el código que queremos usar, en este caso un código muy simple que nos devuelva simpre la misma estructura de datos, según lo necesitemos.

```js
// src/__mocks__/utils.js
export const normalizeData = () => ({ 1: {}, 2: {} });

export const denormalizeData = () => [1, 2, 3, 4];
```

Con nuestros `utils` mockeados, podemos proceder a usarlos en `jest`. Escribiremos en el archivo `App.test.js` el siguiente código.

```js
jest.mock("../utils.js");

import { normalizeData } from "../utils.js";

test("test mocks", () => {
  expect(normalizeData()).toEqual({ 1: {}, 2: {} });
});
```

La linea fundamental en este bloque es `jest.mock("../utils.js");` ya que es en esta linea donde le indicamos a jest cuál es el archivo o módulo que queremos mockear haciendo que jest no tome el código "verdadero" de este archivo sino que usará el código dentro de la carpeta `__mocks__`, posteriormente podremos hacer la importación del método o métodos que queramos usar, estando seguros que el resultado de ejecutar ese código siempre será el mismo y nos permitirá hacer más simples nuestras pruebas.

## Mock de paquetes externos (npm)

Hasta el momento hemos hablado de cómo reemplazar módulos de nuestro proyecto, sin embargo, muchas veces nos vemos en la necesidad de implementar módulos de terceros, paquetes de npm. La buena noticia es que podemos hacer un `mock` de estos módulos externos también.

El paquete del cual crearemos el `mock` es `axios` un módulo que nos permite hacer peticiones http y que usamos en nuestros archivos de redux.

El principio que seguiremos es el mismo que usamos previamente, crearemos dentro de la carpeta `__mocks__` un archivo con el mismo nombre del módulo que queremos reemplazar, es decir, `axios.js`.

```js
.
└── src /
    └── __mocks__/
        ├── axios.js
        └── utils.js
```

Es importante aclarar una cosa, para que nuestro `mock` tenga éxito debemos que saber exactamente cómo está construido el módulo, es decir, en nuestro caso cuando usamos `axios` importamos un objeto con los métodos que nos permiten hacer las peticiones:

```js
import axios from "axios";

/*
axios  = {
    get: () => {},
    post: () => {},
    put: () => {},
    ...
}
*/
```

Esto es importante porque debemos recrear el módulo de la misma forma para que rompa nuestra integración.

Es por esto que dentro del archivo `__mocks__/axios.js` escribiremos el código siguiente:

```js
export default {
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          name: "XBSX Call of Duty Black Ops: Cold War - Standard",
          price: "1619.00",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
        },
      ],
    })
  ),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
};
```

Únicamente usamos 2 métodos, `get` y `patch` ya que estos son los que usamos en nuestro código, usaremos el `util` de `jest.fn()` para indicarle a jest que son funciones y que al ser ejecutadas deben de regresar lo que definimos, el resultado de estas funciones deben de cumplir exactamente lo que nuestro código espera para que todo funcione bien.

### Implementación

La implementación es más simple de lo que hicimos anteriormente, lo único que hay que hacer es importar la librería como lo haríamos normalmente.

```js
jest.mock("../utils.js");

import axios from "axios";

import { normalizeData } from "../utils.js";

test("test mocks", () => {
  expect(normalizeData()).toEqual({ 1: {}, 2: {} });
});
```

Noten que a diferencia de cuando trabajamos con módulos locales, al trabajar con paquetes de terceros (npm) no es necesario usar `jest.mock()`, automaticamente jest usará nuestro `mock` si lo encuentra en la carpeta, de lo contrario usará el módulo original directo de los `node_modules.`
