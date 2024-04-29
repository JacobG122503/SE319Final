import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, { useState, useEffect } from "react";
const products = require('./food/sandwiches.json');


function App() {

  const [viewer, setViewer] = useState(0);

  const render_products = (products) => {

    return <div className='category-section fixed'>
      {console.log("Step 3 : in render_products ")}
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Sandwiches ({products.length})</h2>
      <br/>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {/* Loop */}
        {products.map((product, index) => (
          <div className="col">
            <div className="card shadow-sm">
              <img className="productImage" src={product.image} alt={product.sandwich} />
              <div className="card-body">
                <h3>{product.sandwich}</h3>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary">Add to Cart</button>
                  </div>
                  <small className="text-body-secondary">${product.price}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  }; // end render_products


  function Main() {
    return (
      <div className="album py-5 bg-body-tertiary">
        <div className="container">

          {render_products(products)}
        </div>
      </div>
    );
  }

  const viewMain = () => {
    setViewer(0);
  };


  return (
    <div>
      <header data-bs-theme="dark">
        <div className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={viewMain}
            >
              Home
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
            // onClick={viewRead}
            >
              Read
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
            // onClick={viewUpdate}
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
            // onClick={viewDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </header>
      <br />
      {viewer === 0 && <Main />}
    </div>
  );
}

export default App;
