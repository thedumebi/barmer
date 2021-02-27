import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { getUserDetails, updateUserProfile } from "../actions/user.actions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/user.constants";
import FormContainer from "../components/FormContainer";

const Settings = ({ history }) => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user: userDetail } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error: updateError } = userUpdateProfile;

  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/settings");
    } else {
      if (success) {
        setSuccessMessage(success);
      }
      if (!userDetail || !userDetail.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails(userInfo._id));
      } else {
        setUser((prevValue) => {
          return { ...prevValue, ...userDetail };
        });
      }
    }
  }, [dispatch, history, userInfo, userDetail, success]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    if (user.password !== user.confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
      if (user.password === "") {
        if (user.username === userDetail.username) {
          const { password, confirmPassword, username, ...otherfields } = user;
          dispatch(updateUserProfile(otherfields));
        } else {
          const { password, confirmPassword, ...otherfields } = user;
          dispatch(updateUserProfile(otherfields));
        }
      } else {
        if (user.username === userDetail.username) {
          const { username, ...otherfields } = user;
          dispatch(updateUserProfile(otherfields));
        } else {
          dispatch(updateUserProfile(user));
        }
      }
    }
    event.preventDefault();
  };
  return (
    <div>
      <Link className="btn btn-dark my-3" to="/">
        Back
      </Link>

      <FormContainer>
        <h2>User Settings</h2>
        {error && <Message variant="danger">{error}</Message>}
        {updateError && <Message variant="danger">{updateError}</Message>}
        {successMessage && <Message variant="success">Profile Updated</Message>}
        {loading && <Loader />}

        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={user.password}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={user.confirmPassword}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
          {message && <Message variant="danger">{message}</Message>}

          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="phoneNumber"
              type="text"
              value={user.phoneNumber}
            />
          </Form.Group>

          <Button type="submit" variant="primary" onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default Settings;
