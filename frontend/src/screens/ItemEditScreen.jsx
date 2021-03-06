import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/item/${match.params.id}/edit`);
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
        if (userInfo._id !== itemDetail.store.owner._id) {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, userInfo, itemDetail, success, match]);

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
    formData.append("itemId", item._id);

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
      if (itemDetail.name === item.name) {
        const { name, ...otherfields } = item;
        dispatch(updateItem(otherfields));
      } else {
        dispatch(updateItem(item));
      }
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
        {successMessage && <Message variant="success">Item Updated</Message>}

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
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default ItemEdit;
