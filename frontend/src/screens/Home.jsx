import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

const Home = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  return (
    <div>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {userInfo ? (
        <h1 className="big-heading">Welcome back {userInfo.username}</h1>
      ) : (
        <div>
          <h1>
            Welcome, to the number one trade and barter site. Login or register
            to begin!
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
};

export default Home;
