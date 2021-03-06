import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { STORE_UPDATE_RESET } from "../constants/store.constants";
import FormContainer from "../components/FormContainer";
import { getStoreDetails, updateStore } from "../actions/store.actions";

const StoreEdit = ({ history, match }) => {
  const [store, setStore] = useState({
    _id: "",
    name: "",
    category: "",
    description: "",
    ownerId: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const storeDetails = useSelector((state) => state.storeDetails);
  const { loading, error, store: storeDetail } = storeDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const storeUpdate = useSelector((state) => state.storeUpdate);
  const { success, error: updateError } = storeUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/store/${match.params.id}/edit`);
    } else {
      if (success) {
        setSuccessMessage(success);
      }
      if (!storeDetail || !storeDetail.name || success) {
        dispatch({ type: STORE_UPDATE_RESET });
        dispatch(getStoreDetails(match.params.id));
      } else {
        setStore((prevValue) => {
          return {
            ...prevValue,
            _id: storeDetail._id,
            name: storeDetail.name,
            category: storeDetail.category,
            description: storeDetail.description,
            ownerId: userInfo._id,
          };
        });
        if (userInfo._id !== storeDetail.owner._id) {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, userInfo, storeDetail, success, match]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStore((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    if (storeDetail.name === store.name) {
      const { name, ...otherfields } = store;
      dispatch(updateStore(otherfields));
    } else {
      dispatch(updateStore(store));
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
              value={store.name}
              onChange={handleChange}
              placeholder="Name of Shop"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              onChange={handleChange}
              name="category"
              value={store.category}
            >
              <option value="">Select a Category</option>
              <option value="livestock">LiveStock e.g. cattle, poultry</option>
              <option value="crops">Crops e.g. corn, soybeans, hay</option>
              <option value="dairy">Dairy (milk products)</option>
              <option value="edibleForestryProducts">
                Edible Forestry Products e.g. almonds, walnuts
              </option>
              <option value="fish">Fish Farming</option>
              <option value="miscellaneous">
                Miscellaneous Products e.g. honey
              </option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              onChange={handleChange}
              name="description"
              value={store.description}
              rows={3}
              placeholder="Brief Description of the Store."
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

export default StoreEdit;
