import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Form } from "react-bootstrap";
import { createItem } from "../actions/item.actions";
import { CREATE_ITEM_RESET } from "../constants/item.constants";

const NewItem = ({ history }) => {
  const [item, setItem] = useState({
    name: "",
    image: "",
    quantity: "",
    shopId: "",
  });

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createItemState = useSelector((state) => state.createItem);
  const { loading, error, status } = createItemState;

  const storeDetails = useSelector((state) => state.storeDetails);
  const { store } = storeDetails;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/newitem");
    } else {
      dispatch({ type: CREATE_ITEM_RESET });
      setItem((prevValues) => {
        return { ...prevValues, storeId: store._id };
      });
      if (status) {
        history.push(`/stores/${store._id}`);
      }
    }
  }, [history, dispatch, status, userInfo, store]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    dispatch(createItem(item));
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>New Item</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
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
            Create Item
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default NewItem;
