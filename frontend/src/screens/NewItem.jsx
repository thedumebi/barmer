import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Form } from "react-bootstrap";
import { createItem } from "../actions/item.actions";
import { CREATE_ITEM_RESET } from "../constants/item.constants";
import axios from "axios";
import { getStoreDetails } from "../actions/store.actions";

const NewItem = ({ history, location }) => {
  const [item, setItem] = useState({
    name: "",
    image: "",
    quantity: "",
    storeId: "",
  });

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createItemState = useSelector((state) => state.createItem);
  const { loading, error, status } = createItemState;

  const storeDetails = useSelector((state) => state.storeDetails);
  const { store } = storeDetails;

  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/items/newitem");
    } else {
      if (!store) {
        dispatch(getStoreDetails(location.search.split("=")[1]));
      }
      dispatch({ type: CREATE_ITEM_RESET });
      setItem((prevValues) => {
        return { ...prevValues, storeId: store && store._id };
      });
      if (status) {
        history.push(`/store/${store._id}`);
      }
      if (!store || userInfo._id !== store.owner._id) {
        history.push("/profile");
      }
    }
  }, [history, dispatch, status, userInfo, store, location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const uploadFileHandler = async (event) => {
    const { name, files } = event.target;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setItem((prevValue) => {
        return { ...prevValue, [name]: data };
      });
      setUploadError(null);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  const submitHandler = (event) => {
    if (uploadError === null) {
      dispatch(createItem(item));
    }
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

          <Form.Group>
            <Form.Label>Item Image</Form.Label>
            <Form.Control type="text" value={item.image} readOnly />
            <Form.File
              name="image"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError && <Message variant="danger">{uploadError}</Message>}
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
