import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
const products = require('./food/sandwiches.json');


function App() {

  const [viewer, setViewer] = useState(0);
  const [currentSand, setCurrentSand] = useState([]);

  const render_products = (products) => {

    return <div className='category-section fixed'>
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Sandwiches ({products.length})</h2>
      <br />
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {/* Loop */}
        {products.map((product, index) => (
          <div className="col" key={product.sandwich} >
            <div className="card shadow-sm">
              <img className="productImage" src={product.image} alt={product.sandwich} />
              <div className="card-body">
                <h3>{product.sandwich}</h3>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
                      setCurrentSand(product);
                      viewEditSandwich();
                    }} >Select</button>
                  </div>
                  <small className="text-body-secondary">${product.price}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  };


  function Main() {
    return (
      <div className="album py-5 bg-body-tertiary">
        <div className="container">

          {render_products(products)}
        </div>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <center>
          <br /><br />
          <h2>About</h2>
          <br />
          <p>
            <strong>
              SE/ComS319 Construction of User Interfaces, Spring 2024<br />
              5/9/24<br /><br />
            </strong>

            Jacob Garcia - jacobgar@iastate.edu<br />
            Katharine Endersby - kateende@iastate.edu
          </p>
        </center>
      </div>
    );
  }

  function EditSandwich() {

    const toggleIngredient = (index) => {
      const updatedIngredients = [...currentSand.ingredients];
      updatedIngredients[index].on = !updatedIngredients[index].on;
      setCurrentSand({ ...currentSand, ingredients: updatedIngredients });
    };

    return (
      <div>
        <br /><br />
        <center>
          <div className="customize">
            <h1>Customize Sandwich</h1>
          </div>
          <div className="customize">
            <h2>{currentSand.sandwich}</h2>
          </div>
          <div className="customize">
            <div style={{ width: "250px", height: "250px", overflow: "hidden" }}>
              <img
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                src={currentSand.image}
                alt={currentSand.sandwich}
              />
            </div>
          </div>
        </center>
        <div>
          <h2 style={{ textAlign: "center" }}>Ingredients</h2>
          <p>Bread: {currentSand["bread"]}</p>
          {Object.entries(currentSand.ingredients).map(([key, value], index) => (
            <p key={index}> {value.name}: <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => toggleIngredient(index)} >{value.on ? "Remove" : "Add"}</button></p>
          ))}
          <button type="button" className="btn btn-outline-success" onClick={() => { PostSandwich(currentSand); }}>Add to Cart</button>
          <br/><br/>
        </div>
      </div>
    );
  }


  const PostSandwich = async (sandwichData) => {
    try {
      const response = await fetch('http://localhost:8081/addSandwich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sandwichData),
      });

      if (!response.ok) {
        throw new Error('Failed to post sandwich: ' + response.statusText);
      }

      // Handle success
      const responseData = await response.json();
      console.log('Sandwich posted successfully:', responseData);
      loadCart();
      return responseData;
    } catch (error) {

      console.error('Error posting sandwich:', error);
      throw error;
    }
  };

  const [paymentInfo, setPaymentInfo] = useState({});
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const cartItems = cart.map((el) => (
    <div key={el._id}>
      <img className="img-fluid" src={el.image} width={150} />
      <br />
      {el.sandwich}
      <br />
      <div style={{ fontSize: "20px" }}> ${el.price} </div>
    </div>
  ));

  const total = () => {
    let totalVal = 0;
    for (let i = 0; i < cart.length; i++) {
      totalVal += (cart[i].price);
    }
    setCartTotal(totalVal);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function loadCart() {
    fetch("http://localhost:8081/cart")
      .then((response) => response.json())
      .then((cart) => {
        setCart(cart);
      });
  }

  useEffect(() => {
    loadCart();
  }, []);

  function Cart() {

    const onSubmit = (data) => {
      document.getElementById("fullname").value = "";
      setPaymentInfo(data);
      setViewer(3);
    };

    const cartReturn = () => {
      setViewer(0);
      setPaymentInfo({});
    }

    useEffect(() => {
      total();
    }, [cart]);

    return (
      <div>
        <br /><br />
        <button onClick={cartReturn} className="btn btn-primary">Return</button>
        <br />
        <br />
        <div>{cartItems}</div>
        <br />
        <div style={{ textAlign: "right", fontSize: "20px", fcolor: "red" }}>Total: ${cartTotal}</div>
        <form onSubmit={handleSubmit(onSubmit)} className="container mt-5" id="paymentForm">
          <div className="form-group">
            <p>Full Name</p>
            <input
              {...register("fullName", { required: true })}
              placeholder="" className="form-control"
              id="fullname"
            />
            {errors.fullName && <p className="text-danger">Full Name is required.</p>}
          </div>

          <div className="form-group">
            <p>Email</p>
            <input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="" className="form-control"
            />
            {errors.email && <p className="text-danger">Email is required.</p>}
          </div>

          <div className="form-group">
            <p>Credit Card</p>
            <input
              {...register("creditCard", { required: true, minLength: 16, maxLength: 16 })}
              placeholder="XXXX XXXX XXXX XXXX" className="form-control"
            />
            {errors.creditCard && <p className="text-danger">Credit Card is required.</p>}
          </div>

          <div className="form-group">
            <p>Address</p>
            <input
              {...register("address", { required: true })}
              placeholder="1234 Main St" className="form-control"
            />
            {errors.address && <p className="text-danger">Address is required.</p>}
          </div>

          <div className="form-group">
            <p>Address 2</p>
            <input {...register("address2")} placeholder="Apartment, Studio, or Floor" className="form-control" />
          </div>

          <div className="form-group">
            <p>City</p>
            <input
              {...register("city", { required: true })}
              placeholder="" className="form-control"
            />
            {errors.city && <p className="text-danger">City is required.</p>}
          </div>

          <div className="form-group">
            <p>State</p>
            <input
              {...register("state", { required: true })}
              placeholder="" className="form-control"
            />
            {errors.state && <p className="text-danger">State is required.</p>}
          </div>

          <div className="form-group">
            <p>Zip</p>
            <input {...register("zip", { required: true, minLength: 5, maxLength: 5 })} placeholder="12345" className="form-control" />
            {errors.zip && <p className="text-danger">Zip is required.</p>}
          </div>

          <br />
          <button type="submit" className="btn btn-primary">Order</button>
          <br /><br />
        </form>
      </div>
    );
  }

  function Confirmation() {
    const updateHooks = () => {
      setViewer(0);
      setPaymentInfo({});
      // setCart([]);
    };

    return (
      <div>
        <br /><br /><br />
        <h1>Payment Summary</h1>
        <div>{cartItems}</div>
        <br />
        <div style={{ textAlign: "right", fontSize: "20px", fcolor: "red" }}>Total: ${cartTotal}</div>
        <h3>{paymentInfo.fullName}</h3>
        <p>{paymentInfo.email}</p>
        <p>{paymentInfo.creditCard}</p>
        <p>
          {paymentInfo.address}
          {paymentInfo.address2}
        </p>
        <p>
          {paymentInfo.city}, {paymentInfo.state} {paymentInfo.zip}{" "}
        </p>

        <button onClick={updateHooks} className="btn btn-secondary">Submit</button>
      </div>
    );
  }

  const viewMain = () => {
    setViewer(0);
  };

  const viewAbout = () => {
    setViewer(1);
  };

  const viewEditSandwich = () => {
    setViewer(2);
  };

  const viewCart = () => {
    setViewer(3);
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
              onClick={viewAbout}
            >
              About
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={viewCart}
            >
              Cart
            </button>
          </div>
        </div>
      </header>
      <br />
      {viewer === 0 && <Main />}
      {viewer === 1 && <About />}
      {viewer === 2 && <EditSandwich />}
      {viewer === 3 && <Cart />}
      {viewer === 4 && <Confirmation />}
    </div>
  );
}

export default App;
