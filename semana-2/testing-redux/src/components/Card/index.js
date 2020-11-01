import React from "react";

const Card = ({ image, price, name }) => {
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
      </div>
    </div>
  );
};

export default Card;
