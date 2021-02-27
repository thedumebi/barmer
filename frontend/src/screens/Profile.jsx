import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/user.actions";
import { Link } from "react-router-dom";
import Stores from "../components/Stores";

const Profile = ({ history }) => {
  const [user, setUser] = useState({});

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user: userDetail } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createStoreState = useSelector((state) => state.createStore);
  const { status: shopCreated } = createStoreState;

  const storeDelete = useSelector((state) => state.storeDelete);
  const { error: deleteStoreError, message: deleteStoreMessage } = storeDelete;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/profile");
    } else {
      if (!userDetail || !userDetail.name) {
        dispatch(getUserDetails(userInfo._id));
      }
      setUser((prevValue) => {
        return { ...prevValue, ...userDetail };
      });
    }
  }, [history, userInfo, dispatch, userDetail]);

  return (
    <div>
      <Link className="btn btn-dark my-3" to="/">
        Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {shopCreated && (
            <Message variant="success">
              Your shop was created successfully
            </Message>
          )}
          {deleteStoreError && (
            <Message variant="danger">{deleteStoreError}</Message>
          )}
          {deleteStoreMessage && (
            <Message variant="success">{deleteStoreMessage}</Message>
          )}
          <h1 className="sub-heading"> Welcome {user.name} </h1>
          <p>{user.username}</p>
          <p>{user.phoneNumber}</p>
        </>
      )}
      <hr />
      {user.stores && (
        <div className="section">
          <h2>Manage Your Stores</h2>
          <Row>
            {user.stores.map((store) => {
              return (
                <Col lg={4} key={store._id}>
                  <Stores store={store} />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      <Link className="btn btn-dark my-3" to="/registerstore">
        New Shop
      </Link>
    </div>
  );
};

export default Profile;