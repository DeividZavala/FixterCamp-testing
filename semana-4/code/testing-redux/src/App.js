import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Card from './components/Card';
import Cart from './components/Cart';
import { getProducts } from './redux/productDuck';
import { getCart, editCart } from './redux/cartDuck';
import { denormalizeData } from './utils';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const products = useSelector(state => denormalizeData(state.products.data));
  const status = useSelector(state => state.products.status);
  const error = useSelector(state => state.products.error);
  const cartItems = useSelector(state => state.cart.data);
  const items = denormalizeData(cartItems);

  useEffect(() => {
    if (status === '') dispatch(getProducts());
    if (status === '') dispatch(getCart());
  }, [dispatch]);

  const handleEdit = (item, type) => {
    if (item.id in cartItems) {
      if (type === 'delete' || (type === 'remove' && cartItems[item.id].quantity - 1 === 0)) {
        const filtered = Object.values(cartItems).filter(i => item.id !== i.id);
        const newOrder = { products: filtered };
        dispatch(editCart(newOrder));
      } else {
        const match = { ...cartItems[item.id] };
        const { quantity } = match;
        const newQuantity = type === 'add' ? quantity + 1 : quantity - 1;
        const edited = { ...match, quantity: newQuantity };
        const editedItems = { ...cartItems, [edited.id]: edited };
        const newOrder = { products: denormalizeData(editedItems) };
        dispatch(editCart(newOrder));
      }
    } else {
      const items = { ...cartItems, [item.id]: { ...item, quantity: 1 } };
      const newOrder = { products: denormalizeData(items) };
      dispatch(editCart(newOrder));
    }
  };

  return (
    <div className='App'>
      <Header items={items} />
      <div className='uk-section'>
        <div className='uk-container uk-container-expand'>
          <div className='uk-grid uk-grid-small uk-grid-match'>
            <div className='uk-width-2-3'>
              {status === 'fetching' && <div uk-spinner='ratio: 6'></div>}
              {status === 'finished' && (
                <div
                  id='products-container'
                  className='uk-grid uk-child-width-1-3 uk-grid-small uk-grid-match'
                >
                  {products.map((prod, index) => (
                    <Card key={index} {...prod} addItem={handleEdit} />
                  ))}
                </div>
              )}
              {status === 'error' && (
                <div
                  className='uk-alert-danger uk-flex uk-flex-middle uk-flex-center'
                  uk-alert='true'
                >
                  <p>{error}</p>
                </div>
              )}
            </div>
            <div className='uk-width-1-3'>
              <Cart items={items} editCart={handleEdit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
