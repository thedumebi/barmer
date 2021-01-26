import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Form, Button, Container, Col } from "react-bootstrap";

function Login({ loggedIn, isRegistered }) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const [register, setRegister] = useState({
    username: "",
    fname: "",
    lname: "",
    password: "",
    phone: "",
  });
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  function handleRegister(event) {
    const { name, value } = event.target;
    setRegister((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitRegister() {
    const url = "/api/register";
    axios.post(url, register, { withCredentials: true }).then((res) => {
      if (res.data.status === "success") {
        history.push("/account");
        loggedIn(true);
      } else {
        alert(res.data.status);
      }
    });
  }

  function handleLogin(event) {
    const { name, value } = event.target;
    setLogin((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitLogin() {
    const url = "/api/login";
    axios.post(url, login, { withCredentials: true }).then((res) => {
      if (res.data.status === "success") {
        history.push("/account");
      } else {
        history.push("/login");
      }
    });
  }

  return (
    <div>
      <Container>
        <Form className="form">
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={isRegistered ? handleLogin : handleRegister}
              name="username"
              type="email"
              placeholder="Enter email"
              value={isRegistered ? login.username : register.username}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={isRegistered ? handleLogin : handleRegister}
              name="password"
              type="password"
              placeholder="Password"
              value={isRegistered ? login.password : register.password}
            />
          </Form.Group>

          {!isRegistered && (
            <div>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John"
                    name="fname"
                    onChange={handleRegister}
                    value={register.fname}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Doe"
                    name="lname"
                    onChange={handleRegister}
                    value={register.lname}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  onChange={handleRegister}
                  name="phone"
                  type="text"
                  placeholder="Phone number"
                  value={register.phone}
                />
              </Form.Group>
            </div>
          )}
          <Button
            className="btn btn-dark btn-lg"
            onClick={isRegistered ? submitLogin : submitRegister}
            type="button"
          >
            {isRegistered ? "Login" : "Register"}
          </Button>
        </Form>
        {url === "/login" && (
          <p>
            Don't have an account yet?{" "}
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </p>
        )}
      </Container>
    </div>
  );
}

export default Login;
