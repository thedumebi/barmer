import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import RequestCard from "../components/RequestCard";
import { useDispatch, useSelector } from "react-redux";
import { getRequestDetails } from "../actions/request.actions";
import { Button } from "react-bootstrap";
import {
  REQUEST_ACCEPT_RESET,
  REQUEST_REJECT_RESET,
} from "../constants/request.constants";

const RequestDetailScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const requestDetails = useSelector((state) => state.requestDetails);
  const { loading, error, request } = requestDetails;

  const requestAccept = useSelector((state) => state.requestAccept);
  const { error: acceptError, status: acceptStatus } = requestAccept;

  const requestReject = useSelector((state) => state.requestReject);
  const { error: rejectError, status: rejectStatus } = requestReject;

  useEffect(() => {
    dispatch(getRequestDetails(match.params.id));
    dispatch({ type: REQUEST_ACCEPT_RESET });
    dispatch({ type: REQUEST_REJECT_RESET });
    if (acceptStatus || rejectStatus) {
      history.push("/requests-received");
    }
  }, [dispatch, match, history, acceptStatus, rejectStatus]);

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
          {acceptError && <Message variant="danger">{acceptError}</Message>}
          {rejectError && <Message variant="danger">{rejectError}</Message>}
          {request && (
            <RequestCard
              requestId={request._id}
              item={request.swapItem}
              itemQuantity={request.swapItemQuantity}
              swapItem={request.item}
              swapItemQuantity={request.itemQuantity}
              status={request.status}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RequestDetailScreen;
