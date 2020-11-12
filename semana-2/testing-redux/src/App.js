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
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

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
              {status === "fetching" && <div uk-spinner="ratio: 6"></div>}
              {status === "finished" && (
                <div className="uk-grid uk-child-width-1-3 uk-grid-small uk-grid-match">
                  {products.map((prod, index) => (
                    <Card key={index} {...prod} />
                  ))}
                </div>
              )}
              {status === "error" && (
                <div
                  className="uk-alert-danger uk-flex uk-flex-middle uk-flex-center"
                  uk-alert="true"
                >
                  <p>{error}</p>
                </div>
              )}
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
