import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { login, register } from "../actions/user.actions";

const Login = ({ location, history, match }) => {
  const url = match.url;
  const [registerUser, setRegisterUser] = useState({
    username: "",
    fname: "",
    lname: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: "",
  });
  const [loginUser, setLoginUser] = useState({
    input: "",
    password: "",
  });

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const userRegister = useSelector((state) => state.userRegister);
  const { loading: registerLoading, error: registerError } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  function handleRegister(event) {
    const { name, value } = event.target;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/;
    const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    if (name === "password") {
      if (strongRegex.test(value)) {
        document.getElementById("password-strength").style.backgroundColor =
          "green";
        document.getElementById("password-strength-text").innerText = "strong";
      } else if (mediumRegex.test(value)) {
        document.getElementById("password-strength").style.backgroundColor =
          "orange";
        document.getElementById("password-strength-text").innerText = "medium";
      } else {
        document.getElementById("password-strength").style.backgroundColor =
          "red";
        document.getElementById("password-strength-text").innerText = "weak";
      }
    }
    setRegisterUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
    if (name === "confirmPassword") {
      if (value !== registerUser.password) {
        setMessage("Passwords do not match");
      } else {
        setMessage(null);
      }
    }
  }

  function handleLogin(event) {
    const { name, value } = event.target;
    setLoginUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitHandler() {
    if (url === "/login") {
      dispatch(login(loginUser));
    } else if (url === "/register") {
      if (registerUser.password !== registerUser.confirmPassword) {
        setMessage("Please ensure your password matches");
      } else {
        dispatch(register(registerUser));
      }
    }
  }

  return (
    <FormContainer>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {registerError && <Message variant="danger">{registerError}</Message>}
      {registerLoading && <Loader />}
      <Form className="form">
        <Form.Group>
          <Form.Label>
            {url === "/login" ? "Email address or Username" : "Email address"}
          </Form.Label>
          <Form.Control
            onChange={url === "/login" ? handleLogin : handleRegister}
            name={url === "/login" ? "input" : "email"}
            type={url === "/login" ? "text" : "email"}
            placeholder={
              url === "/login" ? "Enter email or username" : "Enter email"
            }
            value={url === "/login" ? loginUser.input : registerUser.email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={url === "/login" ? handleLogin : handleRegister}
            name="password"
            type="password"
            placeholder="Password"
            value={
              url === "/login" ? loginUser.password : registerUser.password
            }
          />
        </Form.Group>

        {url === "/register" && (
          <div>
            <Form.Group>
              <Form.Text>Password strength</Form.Text>
              <Form.Control id="password-strength" readOnly />
              <Form.Text id="password-strength-text"></Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={registerUser.confirmPassword}
                onChange={handleRegister}
              />
              {message && <Message variant="danger">{message}</Message>}
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John"
                  name="fname"
                  onChange={handleRegister}
                  value={registerUser.fname}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Doe"
                  name="lname"
                  onChange={handleRegister}
                  value={registerUser.lname}
                />
              </Form.Group>
            </Form.Row>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={handleRegister}
                name="username"
                type="text"
                placeholder="Pick a username"
                value={registerUser.username}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={handleRegister}
                name="phoneNumber"
                type="text"
                placeholder="Phone number"
                value={registerUser.phoneNumber}
              />
            </Form.Group>
          </div>
        )}
        <Button
          className="btn btn-dark btn-lg"
          onClick={submitHandler}
          type="button"
        >
          {url === "/login" ? "Login" : "Register"}
        </Button>
      </Form>
      {url === "/login" && (
        <p>
          Don't have an account yet?{" "}
          <Link to="/register">
            <Button className="btn-sm">Register</Button>
          </Link>
        </p>
      )}
      {url === "/register" && (
        <p>
          Have an account?
          <Link to="/login">
            <Button className="btn-sm">Login</Button>
          </Link>
        </p>
      )}
    </FormContainer>
  );
};

export default Login;
