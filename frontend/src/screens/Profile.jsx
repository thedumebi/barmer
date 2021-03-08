import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/user.actions";
import { Link } from "react-router-dom";
import Stores from "../components/Stores";

const Profile = ({ history }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

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
      dispatch(getUserDetails(userInfo._id));
    }
  }, [history, userInfo, dispatch]);

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>
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
          <h1 className="sub-heading"> Welcome {user && user.name} </h1>
          <p>{user && user.username}</p>
          <p>{user && user.phoneNumber}</p>
        </>
      )}
      <hr />
      {user && user.stores && (
        <div className="section">
          <h2>Manage Your Stores</h2>
          <Row>
            {user &&
              user.stores.map((store) => {
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
        New Store
      </Link>
    </div>
  );
};

export default Profile;
