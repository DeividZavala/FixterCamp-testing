import React from "react";
import CartItem from "../CartItem";

const Cart = ({ items }) => {
  return (
    <div className="uk-box-shadow-small uk-padding-small">
      {items.map((item, index) => (
        <CartItem key={index} {...item} />
      ))}
    </div>
  );
};

export default Cart;
