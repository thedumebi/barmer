import React, { useEffect } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { acceptRequest, rejectRequest } from "../actions/request.actions";
import Loader from "./Loader";
import Message from "./Message";

const RequestCard = ({
  requestId,
  item,
  itemQuantity,
  swapItem,
  swapItemQuantity,
  status,
}) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user } = userDetails;

  const requestAcceptStatus = useSelector((state) => state.requestAccept);
  const { error: acceptError, status: acceptStatus } = requestAcceptStatus;

  const requestRejectStatus = useSelector((state) => state.requestReject);
  const { error: rejectError, status: rejectStatus } = requestRejectStatus;

  const dispatch = useDispatch();

  useEffect(() => {
    if (acceptStatus || rejectStatus) {
      history.push("/requests-received");
    }
  }, [history, acceptStatus, rejectStatus]);

  const acceptHandler = (event) => {
    dispatch(acceptRequest(requestId));
    event.preventDefault();
  };

  const rejectHandler = (event) => {
    dispatch(rejectRequest(requestId));
    event.preventDefault();
  };

  return (
    <div className="request">
      {acceptError && <Message variant="danger">{acceptError}</Message>}
      {rejectError && <Message variant="danger">{rejectError}</Message>}
      {loading && <Loader />}
      <i
        className="fas fa-arrows-alt-h fa-2x"
        style={{ margin: "auto 46%" }}
      ></i>
      <br />
      <div className="section">
        {item && item.image && (
          <div className="heading">
            <Link to={`/item/${item._id}`}>
              <Image src={`/${item.image}`} alt={item.name} />
            </Link>
          </div>
        )}
        <div className="content">
          <h1 className="sub-heading">{item.name}</h1>
          <small>{item.store.category}</small>
          <p>
            {url.path === "/requests-sent"
              ? "Number Requested:"
              : "Number Offered:"}{" "}
            {itemQuantity}
          </p>
        </div>
      </div>

      <div className="section">
        {swapItem && swapItem.image && (
          <div className="heading">
            <Link to={`/item/${swapItem._id}`}>
              <Image src={`/${swapItem.image}`} alt={swapItem.name} />
            </Link>
          </div>
        )}
        <div className="content">
          <h1 className="sub-heading">{swapItem.name}</h1>
          <small>{swapItem.store.category}</small>
          <p>
            {url.path === "/requests-sent"
              ? "Number Offered:"
              : "Number Requested:"}{" "}
            {swapItemQuantity}
          </p>
        </div>
      </div>

      <br />

      {status && <p style={{ fontWeight: 700 }}>Status: {status}</p>}

      {url.path === "/requests-received" && user && (
        <Link to={`/requests/${requestId}`}>
          <Button className="btn-dark" type="button">
            View Request
          </Button>
        </Link>
      )}

      {url.path === "/requests-sent" &&
        status &&
        status !== "accepted" &&
        user &&
        user.outgoingRequests.find((request) => request._id === requestId) && (
          <Link to={`/item/${item._id}/edit-request`}>
            <Button className="btn-dark" type="button">
              Edit Request
            </Button>
          </Link>
        )}

      {url.path === "/requests/:id" &&
        status &&
        status !== "accepted" &&
        user &&
        user.incomingRequests.find((request) => request._id === requestId) && (
          <Button className="btn-dark" type="button" onClick={acceptHandler}>
            Accept
          </Button>
        )}

      {url.path === "/requests/:id" &&
        status &&
        status !== "rejected" &&
        user &&
        user.incomingRequests.find((request) => request._id === requestId) && (
          <Button className="btn-dark" type="button" onClick={rejectHandler}>
            Reject
          </Button>
        )}
    </div>
  );
};

export default RequestCard;
