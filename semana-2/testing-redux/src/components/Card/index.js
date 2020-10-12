import React from "react";

const Card = () => {
  return (
    <div>
      <div className="uk-card uk-card-default uk-margin-medium-bottom">
        <div className="uk-card-media-top">
          <img src="https://getuikit.com/docs/images/light.jpg" alt="" />
        </div>
        <div className="uk-card-body uk-padding-small">
          <h3 className="uk-card-title">Media Top</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
