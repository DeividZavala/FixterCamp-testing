import React from "react";
import CartItem from "../CartItem";

const Cart = ({ items, editCart }) => {
  return (
    <div className="uk-box-shadow-small uk-padding-small">
      {items.map((item, index) => (
        <CartItem key={index} {...item} editCart={editCart} />
      ))}
    </div>
  );
};

export default Cart;
