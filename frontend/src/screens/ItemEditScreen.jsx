import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { ITEM_UPDATE_RESET } from "../constants/item.constants";
import { getItemDetails, updateItem } from "../actions/item.actions";

const ItemEdit = ({ history, match }) => {
  const [item, setItem] = useState({
    _id: "",
    name: "",
    image: "",
    storeId: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item: itemDetail } = itemDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const itemUpdate = useSelector((state) => state.itemUpdate);
  const { success, error: updateError } = itemUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/items/newitem");
    } else {
      if (success) {
        setSuccessMessage(success);
      }
      if (!itemDetail || !itemDetail.name || success) {
        dispatch({ type: ITEM_UPDATE_RESET });
        dispatch(getItemDetails(match.params.id));
      } else {
        setItem((prevValue) => {
          return {
            ...prevValue,
            _id: itemDetail._id,
            name: itemDetail.name,
            image: itemDetail.image,
            storeId: itemDetail.store._id,
          };
        });
      }
    }
  }, [dispatch, history, userInfo, itemDetail, success, match]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    if (itemDetail.name === item.name) {
      const { name, ...otherfields } = item;
      dispatch(updateItem(otherfields));
    } else {
      dispatch(updateItem(item));
    }
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>Edit Store</h2>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {updateError && <Message variant="danger">{updateError}</Message>}
        {successMessage && <Message variant="success">Store Updated</Message>}

        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              placeholder="Name of Item"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange}
              name="quantity"
              value={item.quantity}
              placeholder="Number of Item."
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

export default ItemEdit;
