import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Card from "./components/Card";
import Cart from "./components/Cart";
import { getProducts } from "./redux/productDuck";
import { denormalizeData } from "./utils";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const products = useSelector((state) => denormalizeData(state.products.data));

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <div className="uk-section">
        <div className="uk-container uk-container-expand">
          <div className="uk-grid uk-grid-small uk-grid-match">
            <div className="uk-width-2-3">
              <div className="uk-grid uk-child-width-1-3 uk-grid-small uk-grid-match">
                {products.map((prod) => (
                  <Card {...prod} />
                ))}
              </div>
            </div>
            <div className="uk-width-1-3">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
