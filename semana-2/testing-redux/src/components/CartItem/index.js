import React from 'react';

const CartItem = ({ id, name, price, image, quantity = 1, editCart }) => {
  return (
    <div className='uk-box-shadow-small uk-margin-small-bottom'>
      <div className='uk-grid-small uk-flex-middle' uk-grid='true'>
        <div className='uk-width-auto'>
          <img className='' alt={name} width='100' height='100' src={image} />
        </div>
        <div className='uk-width-expand uk-text-left'>
          <h3 className='uk-card-title uk-margin-remove-bottom uk-text-truncate'>{name}</h3>
          <p className='uk-text-meta uk-margin-remove-top'>
            <span className='uk-text-meta'>Subtotal: ${price * quantity}</span>
          </p>
        </div>
        <div className='uk-width-1-4 items-quantity'>
          <button
            onClick={() => editCart({ id, name, price, image, quantity }, 'remove')}
            className='uk-button'
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => editCart({ id, name, price, image, quantity }, 'add')}
            className='uk-button'
          >
            +
          </button>
        </div>
        <div className='uk-width-auto uk-margin-medium-right'>
          <span
            onClick={() => editCart({ id }, 'delete')}
            className='trash'
            uk-icon='icon:trash;ratio:1.5'
          ></span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
