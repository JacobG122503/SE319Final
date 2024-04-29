import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, { useState, useEffect } from "react";


function App() {

  const [viewer, setViewer] = useState(1);

  function Main() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>Home</h1>
              <p>
                This is a simple CRUD application using React, Flask, and MySQL.
              </p>
              <p>
                Click on the buttons above to navigate through the application.
              </p>
            </div>
          </div>
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
        <div class="navbar navbar-dark shadow-sm">
          <div class="container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={viewMain}
            >
              Home
            </button>
            <button
              type="button"
              className="btn btn-primary"
            // onClick={viewRead}
            >
              Read
            </button>
            <button
              type="button"
              className="btn btn-primary"
            // onClick={viewUpdate}
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-primary"
            // onClick={viewDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </header>
      {viewer === 0 && <Main />}
    </div>
  );
}

export default App;
