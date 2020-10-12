import React from "react";
import Header from "./components/Header";
import Card from "./components/Card";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="uk-section">
        <div className="uk-container uk-container-expand">
          <div className="uk-grid uk-grid-small">
            <div className="uk-width-2-3">
              <div className="uk-grid uk-child-width-1-3 uk-grid-small">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </div>
            <div className="uk-width-1-3">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
