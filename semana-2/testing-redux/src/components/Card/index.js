import React from "react";

const Card = ({ id, image, price, name, addItem }) => {
  return (
    <div>
      <div className="uk-card uk-card-default uk-margin-medium-bottom">
        <div className="uk-card-media-top">
          <img src={image} alt={name} />
        </div>
        <div className="uk-card-body uk-padding-small">
          <h3 className="uk-card-title">{name}</h3>
          <p>${price}</p>
        </div>
        <div className="uk-card-footer">
          <button
            onClick={() => addItem({ id, image, price, name }, "add")}
            className="uk-button uk-button-primary"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
