import React, { useState, useRef } from "react";
import useQueue from "./hooks/useQueue";
import "./App.css";

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

export default App;
