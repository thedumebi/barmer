import React, { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserDetails } from "../actions/user.actions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import RequestCard from "../components/RequestCard";

const RequestsReceived = ({ history }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/requests-received");
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
          {user && user.incomingRequests.length === 0 ? (
            <>
              <h1 className="big-heading">
                You have not received any item swap requests yet
              </h1>
              <Link to="/items">
                <Button className="btn btn-lg btn-dark">Get Started</Button>
              </Link>
            </>
          ) : (
            <Row>
              {user &&
                user.incomingRequests.map((request) => {
                  return (
                    <Col lg={4} md={6} key={request._id}>
                      <RequestCard
                        requestId={request._id}
                        item={request.swapItem}
                        itemQuantity={request.swapItemQuantity}
                        swapItem={request.item}
                        swapItemQuantity={request.itemQuantity}
                        status={request.status}
                      />
                    </Col>
                  );
                })}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default RequestsReceived;
