import React from "react";

const CartItem = () => {
  return (
    <div className="uk-box-shadow-small uk-margin-small-bottom">
      <div className="uk-grid-small uk-flex-middle" uk-grid="true">
        <div className="uk-width-auto">
          <img
            className=""
            alt=""
            width="100"
            height="100"
            src="https://getuikit.com/docs/images/avatar.jpg"
          />
        </div>
        <div className="uk-width-expand uk-text-left">
          <h3 className="uk-card-title uk-margin-remove-bottom">Title</h3>
          <p className="uk-text-meta uk-margin-remove-top">
            <time datetime="2016-04-01T19:00">April 01, 2016</time>
          </p>
        </div>
        <div className="uk-width-auto uk-margin-medium-right" ><span className="trash" uk-icon="icon:trash;ratio:1.5"></span></div>
      </div>
    </div>
  );
};

export default CartItem;
