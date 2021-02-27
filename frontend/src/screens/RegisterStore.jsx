import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { createStore } from "../actions/store.actions";
import { CREATE_STORE_RESET } from "../constants/store.constants";

const RegisterStore = ({ history }) => {
  const [shop, setShop] = useState({
    ownerId: "",
    name: "",
    category: "",
    description: "",
  });

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createStoreState = useSelector((state) => state.createStore);
  const { loading, error, status } = createStoreState;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/registerstore");
    } else {
      dispatch({ type: CREATE_STORE_RESET });
      setShop((prevValues) => {
        return { ...prevValues, ownerId: userInfo._id };
      });
      if (status) {
        history.push("/profile");
      }
    }
  }, [history, userInfo, dispatch, status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShop((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    dispatch(createStore(shop));
    event.preventDefault();
  };

  return (
    <div>
      <Link className="btn btn-dark my-3" to="/profile">
        Back
      </Link>

      <FormContainer>
        <h2>New Store</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={shop.name}
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
              value={shop.category}
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
              value={shop.description}
              rows={3}
              placeholder="Brief Description of the Store."
            />
          </Form.Group>

          <Button type="submit" variant="primary" onClick={submitHandler}>
            Create Shop
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default RegisterStore;
