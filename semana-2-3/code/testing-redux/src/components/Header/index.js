import React from 'react';

const Header = ({ items }) => {
  const total = items.reduce((acc, item) => (acc += item.quantity), 0);
  return (
    <nav className='uk-navbar-container' uk-navbar='true'>
      <div className='uk-navbar-left'>
        <a className='uk-navbar-item uk-logo' href='/'>
          FixterCommerce
        </a>
      </div>

      <div className='uk-navbar-right'>
        <ul className='uk-navbar-nav'>
          <li className='uk-margin-medium-right'>
            <span className='cart' uk-icon='icon: cart;ratio:2'>
              <span className='uk-badge'>{total}</span>
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
