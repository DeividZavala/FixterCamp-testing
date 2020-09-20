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
