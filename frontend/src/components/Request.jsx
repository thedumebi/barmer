import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import FormContainer from "./FormContainer";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../actions/item.actions";
import Message from "./Message";
import Loader from "./Loader";
import {
  createRequest,
  getRequestDetails,
  updateRequest,
} from "../actions/request.actions";
import { REQUEST_DETAILS_RESET } from "../constants/request.constants";

const Request = ({ item, user }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const [request, setRequest] = useState({
    _id: "",
    itemId: item._id,
    itemQuantity: "",
    swapItemId: "",
    swapItemQuantity: "",
    comment: "",
  });

  const dispatch = useDispatch();
  const requestDetails = useSelector((state) => state.requestDetails);
  const { request: requestDetail } = requestDetails;

  const createRequestStatus = useSelector((state) => state.createRequest);
  const { loading, error: requestError, status } = createRequestStatus;

  const updateRequestStatus = useSelector((state) => state.requestUpdate);
  const { error: updateError, success } = updateRequestStatus;

  const itemList = useSelector((state) => state.itemList);
  const { error, items } = itemList;
  const [quantityError, setQuantityError] = useState(null);
  const [swapQuantityError, setSwapQuantityError] = useState(null);

  useEffect(() => {
    if (!items) {
      dispatch(getItems());
    }
    if (
      user &&
      !requestDetail &&
      user.outgoingRequests.find(
        (madeRequest) => madeRequest.item._id === item._id
      )
    ) {
      dispatch(
        getRequestDetails(
          user.outgoingRequests.find(
            (madeRequest) => madeRequest.item._id === item._id
          )._id
        )
      );
    }
    if (requestDetail) {
      setRequest((prevValues) => {
        return {
          ...prevValues,
          _id: requestDetail._id,
          itemId: requestDetail.item._id,
          itemQuantity: requestDetail.itemQuantity,
          swapItemId: requestDetail.swapItem._id,
          comment: requestDetail.comment,
        };
      });
    }
  }, [dispatch, items, user, item, requestDetail]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "itemQuantity") {
      setRequest((prevValues) => {
        return { ...prevValues, [name]: value };
      });
      if (value > item.quantity) {
        setQuantityError(`The maximum number available is ${item.quantity}`);
      } else if (value < 1) {
        setQuantityError(`The minimum number for a swap is one(1)`);
      } else {
        setQuantityError(null);
      }
    } else if (name === "swapItemQuantity") {
      setRequest((prevValues) => {
        return { ...prevValues, [name]: value };
      });
      const itemQuantity = items.find((item) => item._id === request.swapItemId)
        .quantity;
      const itemName = items.find((item) => item._id === request.swapItemId)
        .name;
      if (value > itemQuantity) {
        setSwapQuantityError(
          `The maximum number available for ${itemName} is ${itemQuantity}`
        );
      } else if (value < 1) {
        setSwapQuantityError("The minimum number for a swpa is one(1)");
      } else {
        setSwapQuantityError(null);
      }
    } else {
      setRequest((prevValues) => {
        return {
          ...prevValues,
          [name]: value,
        };
      });
    }
  };

  const submitNewRequest = (event) => {
    if (quantityError === null) {
      dispatch(createRequest(request));
      dispatch({ type: REQUEST_DETAILS_RESET });
    }
    if (status) {
      history.push("/requestsmade");
    }
    event.preventDefault();
  };

  const submitUdateRequest = (event) => {
    if (quantityError === null) {
      dispatch(updateRequest(request));
      dispatch({ type: REQUEST_DETAILS_RESET });
    }

    if (success) {
      history.push("/requestsmade");
    }
    event.preventDefault();
  };

  return (
    <FormContainer>
      {requestError && <Message variant="danger">{requestError}</Message>}
      {updateError && <Message variant="danger">{updateError}</Message>}
      {loading && <Loader />}
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Form>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                onChange={handleChange}
                name="itemQuantity"
                value={request.itemQuantity}
                max={item.quantity}
                min={1}
                placeholder="How many do you want?"
              />
              {quantityError && (
                <Message variant="danger">{quantityError}</Message>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Swap Item</Form.Label>
              {error && <Message variant="danger">{error}</Message>}
              <Form.Control
                as="select"
                onChange={handleChange}
                name="swapItemId"
                value={request.swapItemId}
              >
                <option value="">Select your item to swap with</option>
                {items &&
                  user &&
                  items
                    .filter((item) => item.store.owner._id === user._id)
                    .map((swapItem) => {
                      return (
                        <option key={swapItem._id} value={swapItem._id}>
                          {swapItem.name}
                        </option>
                      );
                    })}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Swap Item Quantity</Form.Label>
              <Form.Control
                type="number"
                onChange={handleChange}
                name="swapItemQuantity"
                value={request.swapItemQuantity}
                max={
                  items &&
                  items.find((item) => item._id === request.swapItemId) &&
                  items.find((item) => item._id === request.swapItemId).quantity
                }
                min={1}
                placeholder="Quantity you are offering?"
              />
              {swapQuantityError && (
                <Message variant="danger">{swapQuantityError}</Message>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                onChange={handleChange}
                name="comment"
                value={request.comment}
                rows={3}
              />
            </Form.Group>

            {url.path === "/item/:id/request" && (
              <Button
                type="submit"
                variant="primary"
                onClick={submitNewRequest}
              >
                Submit Request
              </Button>
            )}

            {url.path === "/item/:id/edit-request" && (
              <Button
                type="submit"
                variant="primary"
                onClick={submitUdateRequest}
              >
                Update Request
              </Button>
            )}
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </FormContainer>
  );
};

export default Request;
