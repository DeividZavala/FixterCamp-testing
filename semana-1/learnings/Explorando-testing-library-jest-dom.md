<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# ¿Qué es testing-Library/jest-dom?

La librería @testing-library/jest-dom proporciona un conjunto de `matchers` personalizados que puedes usar en conjunto con los ya existentes en jest, los `matchers` de `@testing-library/jest-dom` permiten crear test mas declarativos, claros, faciles de leer y mantener.

### Instalación

```bash
$ npm install --save-dev @testing-library/jest-dom
```

o si prefieres usar `yarn`

```bash
$ yarn add --dev @testing-library/jest-dom
```

### Uso

En nuestro caso gracias a que estamos usando CRA, esta librería ya esta configurada en el archivo `setupTests.js`

Una vez instalado el paquete, si no estás usando CRA, puedes configurarlo de la siguiente manera:

```js
// En tu archivo jest-setup.js (o cualquier otro nombre)
import "@testing-library/jest-dom";

// En el archivo jest.config.js agrega
setupFilesAfterEnv: ["<rootDir>/jest-setup.js"];
```

## Primer test

### Componente a testear

Para nuestras pruebas crearemos un archivo `Basic.js` donde crearemos un componente muy simple que va a mostrar la información que le pasemos por medio del prop data, el código del componente es:

```js
import React from "react";

const Basic = ({ title, data }) => {
  return (
    <>
      <h1>{title}</h1>
      {data ? (
        <ul>
          {data.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No hay información para mostrar</p>
      )}
    </>
  );
};

export default Basic;
```

Una vez listo el componente, crearemos la prueba dentro del archivo `Basic.test.js`, nuestra prueba consiste en comprobar que el componente muestre la información y se dibuje de forma correcta en el navegador, para esto montaremos el componente usando el método `render`, mandaremos los props necesarios `title` y `data` con los siguientes valores:

```js
render(<Basic title="Lista" data={["test 1", "test 2"]} />);
```

### Queries

Con el componente montado en nuestro dom virtual, el siguiente paso es obtener los nodos correspondientes al `title` y los elementos de la lista, usaremos los queries de `getByRole` y `getAllByRole`. La librería nos dice que `ByRole` debería ser nuestra primer opción para buscar elementos en el árbol de nodos. Podemos encontrar más información al respecto [aquí](https://testing-library.com/docs/queries/about#priority).

Para hacer la busqueda vamos a aprovechar los roles que tiene cada elemento, por ejemplo, las etiquetas `<h1 />` tiene el role `heading` y las etiquetas `<li/>` tiene el role de `listitem`, podemos encontrar una referencia de los roles existentes [aquí](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles)

Hecho esto nuestros queries quedan de la siguiente forma:

```js
const header = screen.getByRole("heading", { name: "Lista" });
const listItems = screen.getAllByRole("listitem");
```

Si por alguna razón nuestros quaries no encuentran ningún elemento podremos ver al correr nuestras pruebas que en la terminal se nos van a mostrar, si es que existen, los roles disponibles en el árbol de nodos.

### Assertions

Para finalizar haremos nuestras comprobaciones. Aquí es donde `jest-dom` entra en juego, uno de los `assertions` que `jest-dom` nos expone es `toBeInTheDocument` y nos va a permitir asegurar que el elemento se encuentra en el dom.

```js
expect(listItems.length).toBe(2);
expect(header).toBeInTheDocument();
```

Al final nuestra prueba se ve así:

```js
describe("Basic", () => {
  it("should render", () => {
    render(<Basic title="Lista" data={["test 1", "test 2"]} />);
    const header = screen.getByRole("heading", { name: "Lista" });
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);
    expect(header).toBeInTheDocument();
  });
});
```
