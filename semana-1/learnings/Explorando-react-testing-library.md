<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# ¿Qué es? y ¿Por qué React Testing Library?

Testing Library surgió con el siguiente planteamiento: Quieres escribir pruebas mantenibles que te den una gran confianza en que tus componentes funcionan para tus usuarios. Como parte de este objetivo, quieres que tus pruebas no incluyan detalles de implementación para que las refactorizaciones de tus componentes (cambios en la implementación, pero no en la funcionalidad) no rompan tus pruebas y te ralenticen a ti y a tu equipo.

La biblioteca principal, DOM Testing Library, es una solución ligera para probar páginas web consultando e interactuando con nodos del DOM (ya sea simulado con JSDOM/Jest o en el navegador). Las principales utilidades que proporciona consisten en consultar el DOM en busca de nodos de forma similar a como el usuario encuentra los elementos en la página. De este modo, la biblioteca ayuda a garantizar que tus pruebas te den la seguridad de que tu aplicación funcionará cuando la utilice un usuario real.

Para este proposito Testing Library nos expone una serie de métodos que nos permiten hacer estas busquedas partiendo de distintos elementos, como el texto, label, placeholder o role.

Podemos ver el comportamiento de estos métodos en la siguiente tabla, donde podemos ver que, por ejemplo, todos los métodos que contengan `getBy` devolverán un error si no encuentran coincidencias o enciuentrán más de una, si encuentran coincidencias devolverán el nodo correspondiente y por último este método no esperará a encontrar el elemento, hará una busqueda y de no encontrar coincidecia devolverá el error. Así el mismo principio con los demás.

|                | No Match | 1 Match | 1+ Match | Await? |
| -------------- | -------- | ------- | -------- | ------ |
| **getBy**      | throw    | return  | throw    | No     |
| **findBy**     | throw    | return  | throw    | Yes    |
| **queryBy**    | null     | return  | throw    | No     |
| **getAllBy**   | throw    | array   | array    | No     |
| **findAllBy**  | throw    | array   | array    | Yes    |
| **queryAllBy** | []       | array   | array    | No     |

Lo elementos con los cuales podemos combinar estos queries son los siguientes:

- ByLabelText
- ByPlaceholderText
- ByText
- ByDisplayValue
- ByAltText
- ByTitle
- ByRole
- ByTestId

Por último es importante señalar que hay queries que representan una mejor practica a la hora de hacer una busqueda, por ejemplo, el primer query que es recomendado usar es `getByRole`. Se puede utilizar para consultar todos los elementos expuestos en el árbol de accesibilidad. Con la opción nombre puedes filtrar los elementos devueltos por su nombre accesible. Esta debería ser tu principal preferencia para casi todo. No hay mucho que no puedas conseguir con esto (si no puedes, es posible que tu UI sea inaccesible). La mayoría de las veces, se utilizará con la opción de `name`, así:

```js
getByRole("button", { name: /submit/i });
```

Puedes consultar más sobre el orden que deberias seguir para seleccionar el query [aquí](https://testing-library.com/docs/queries/about#priority)

### Referencias

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Library cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Which query should I use?](https://testing-library.com/docs/queries/about#priority)
