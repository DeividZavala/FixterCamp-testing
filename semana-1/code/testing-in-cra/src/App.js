import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [elements, setElements] = useState([]);
  const [error, setError] = useState();
  const inputRef = useRef();
  const addElement = () => {
    const { value } = inputRef.current;
    if (!value) return setError("Debes agregar texto");
    setElements((prev) => [...prev, value]);
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
