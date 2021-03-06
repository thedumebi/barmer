import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Stores from "../components/Stores";
import { useDispatch, useSelector } from "react-redux";
import { getStoreDetails } from "../actions/store.actions";
import { Button } from "react-bootstrap";

const Store = ({ history, match }) => {
  const dispatch = useDispatch();

  const storeDetails = useSelector((state) => state.storeDetails);
  const { loading, error, store } = storeDetails;

  useEffect(() => {
    dispatch(getStoreDetails(match.params.id));
  }, [dispatch, match]);

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
        store && <Stores store={store} />
      )}
    </div>
  );
};

export default Store;
