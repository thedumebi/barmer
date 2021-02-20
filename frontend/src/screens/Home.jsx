import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function Home({loggedIn}) {
    return (
      <div className="container center">
        {loggedIn ? (
          <h1 className="big-heading">Welcome to Enye Trade and Barter Side.</h1>
        ) : (
          <div>
            <h1>
              Welcome, to the number one trade and barter site. Login or register to
              begin!
            </h1>
            <Link to="/register">
              <Button className="btn btn-lg btn-dark">Register</Button>
            </Link>
            <Link to="/login">
              <Button className="btn btn-lg btn-dark">Login</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  export default Home;