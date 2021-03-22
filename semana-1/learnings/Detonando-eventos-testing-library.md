<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Detonando eventos con React Testing Library

React Testing Library nos ofrece un par de herramientas para poder simular eventos en nuestras pruebas, eventos que el usuario podría ejecutar en nuestra aplicación, esto nos va a permitir testear clicks en botones, escribir en inputs o hacer uso de componentes como dropdowns, para poder de esa forma testear nuestro código e interactuar con él de la misma forma en la que lo haría un usuario.

La primera opción que tenemos es usar el módulo `fireEvent` que viene del paquete `@testing-library/react`, gracias a esto, no es necesario intalar nada más para empezar a simular eventos en nuestra aplicación, su implementación es muy simple, este módulo nos expondrá métodos para cada evento, por ejemplo, para un click podemos usar `fireEvent.click` o para escribir en un input podemos usar `fireEvent.change`, estos métodos al igual que los demás del módulo van a necesitar que les pasemos el nodo con el cual van a interactuar.

```js
fireEvent.click(screen.getByText("Submit"));
```

Este módulo es perfecto para cuando buscamos interacciones simples como sería únicamente un click, esto se debe a que los eventos que genera este módulo en algunos casos no son tan similares a los que tendríamos en el navegador.

Esto nos lleva a nuestra segunda opción `userEvent`. Éste es un paquete aparte a `@testing-library/react` por lo que en proyectos que no hayan sido creados con CRA o que hayan usado las primeras versiones de éste, tendrán que instalar el paquete.

```bash
$ yarn add @testing-library/user-event --dev o $ npm install @testing-library/user-event --save-dev
```

`userEvent` será la opción que la gran mayoría de las veces tendremos que usar ya que esta opción fue creada para generar evento más completos y similares a los que tenemos en el navegador. Este módulo permite que nuestro componente reaccione de la misma forma a como lo hará en el navegador ya que se detonarán eventos subyacentes al evento original, es decir, tomando como ejemplo la siguiente interacción `userEvent.click(checkbox)` userEvent no solamente simulará el click en el elemento si no que también se encargará de asegurar el cambio en el estado del checkbox.

## Ejecuntando nuestras pruebas.

En nuestro caso, el componente que vamos a testear es el siguiente:

```js
function App({ data = [] }) {
  const [elements, setElements] = useState(data);
  const [error, setError] = useState();
  const inputRef = useRef();
  const { add } = useQueue();

  const addElement = () => {
    const { value } = inputRef.current;
    if (!value) return setError("Debes agregar texto");
    setElements((prev) => [...prev, value]);
    add(value);
    inputRef.current.value = "";
    setError(undefined);
  };

  return (
    <div className="App">
      {elements.length ? (
        <ul>
          {elements.map((element, i) => (
            <li key={i}>{element}</li>
          ))}
        </ul>
      ) : (
        <h1>Sin elementos para mostrar</h1>
      )}
      <div>
        <input ref={inputRef} placeholder="Ingresa el texto" />
        <button onClick={addElement}>agregar</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
```

Es un componente simple con un comportamiento igual al ya conocido, TODO list donde tendremos un input en el cual podremos escribir e ir agregando elementos a una lista.

Dividiremos nuestras pruebas en 2 bloques, uno que use el `fireEvent` y otro bloque que use el `userEvent`, los bloques tendrán las mismas pruebas pero usaremos sixtáxis de cada módulo en particular.

### Importaciones

Lo primero que haremos es importar lo que vamos a utilizar:

```js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
```

### Tests

Ya con las importaciones, crearemos nuestros bloques:

```js
describe("<App/>", () => {
  // fireEvent
  it("should add new items", () => {});
  it("should show error message if empty input", () => {});

  // userEvent
  it("should add new items", () => {});
  it("should show error message if empty input", () => {});
});
```

### FireEvent

Primero nos centraremos en `fireEvent`.

1. Para la primera prueba vamos a montar nuestro componente `render`
2. Una vez montado usaremos el método change de `fireEvent` de la siguiente forma: `fireEvent.change()`
3. Como primer argumento mandaremos el nodo al cual queremos aplicarle el evento, que en este caso es el input y como segundo argumento mandaremos un objeto con el texto que queremos en el input:

```js
fireEvent.change(screen.getByRole("textbox"), {
  target: { value: "nuevo item" },
});
```

4. Usaremos `fireEvent.click(screen.getByRole("button"))` sobre el button.
5. Repetiremos el proceso para agregar un segundo elemento a la lista.
6. Para finalizar, comprobaremos que existan 2 elementos en mi lista.

Después de estos pasos nuestro test debe lucir así:

```js
describe("<App/>", () => {
  // fireEvent
  it("should add new items", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item" },
    });
    fireEvent.click(screen.getByRole("button"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item 2" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("listitem").length).toBe(2);
  });
});
```

Para la segunda prueba, haremos algo mucho más simple, buscamos comprobar que nos muestre un mensaje de error si damos click al botón sin haber agregado texto al input.

Los pasos que seguiremos son:

1. Montar el componente
2. Detonar el click en el botón
3. Buscar y asegurar que el mensaje de error esté en el documento.

Con esto nuestra prueba se ve así:

```js
it("should show error message if empty input", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
});
```

### userEvent

Ahora es el turno de userEvent, para nuestras pruebas seguiremos los mismos pasos del bloque anterior, con esto nuestra primer prueba se ve así:

```js
// userEvent
it("should add new items", () => {
  render(<App />);
  userEvent.type(screen.getByRole("textbox"), "nuevo item con user event");
  userEvent.click(screen.getByRole("button"));
  expect(screen.getAllByRole("listitem").length).toBe(1);
});
```

Lo primero que podemos notar es la diferencia en el método y como es que mandamor el texto, con este módulo usamos `userEvent.type()` siendo éste mucho más explicito en cuanto al evento que estamos detonando, lo segundo a observar es lo fácil que es mandar el texto, mientras en el bloque anterior tuvimos que mandar una objeto con una estructura específica, con esta implementación lo único que hay que hacer es mandar el texto que queremos y listo, lo demás es muy similar.

Para la segunda prueba:

```js
it("should show error message if empty input", () => {
  render(<App />);
  userEvent.click(screen.getByRole("button"));
  expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
});
```

Podemos notar que no hay mucha diferencia en cuanto a la integración. Sin embargo, tenemos la ventaja de que el evento que estamos generando nos va ejecutar los eventos adyancentes al click, en algunos casos podría ser un focus o un cambio de estado en el elemento.

## Código final

```js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";
import App from "./App";

describe("<App/>", () => {
  // fireEvent
  it("should add new items", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item" },
    });
    fireEvent.click(screen.getByRole("button"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nuevo item 2" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("listitem").length).toBe(2);
  });
  it("should show error message if empty input", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
  });

  // userEvent
  it("should add new items", () => {
    render(<App />);
    userEvent.type(screen.getByRole("textbox"), "nuevo item con user event");
    userEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("listitem").length).toBe(1);
  });
  it("should show error message if empty input", () => {
    render(<App />);
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Debes agregar texto")).toBeInTheDocument();
  });
});
```
