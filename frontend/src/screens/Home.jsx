import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Image, Row } from "react-bootstrap";
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
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome back {userInfo.username}</h1>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      ) : (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome to our store.</h1>
            <p>Exchange goods in a simple way</p>
            <Link to="/login">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Home;
