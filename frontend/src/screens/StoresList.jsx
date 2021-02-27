import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStores } from "../actions/store.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Stores from "../components/Stores";

const StoresList = ({ history }) => {
  const [stores, setStores] = useState([]);
  const dispatch = useDispatch();

  const storesList = useSelector((state) => state.storeList);
  const { loading, error, stores: storeList } = storesList;

  useEffect(() => {
    if (!storeList) {
      dispatch(getStores());
    }
    setStores(storeList);
  }, [dispatch, storeList]);
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
          {stores && stores.length === 0 ? (
            <h1 className="big-heading">Stores are coming soon ;)</h1>
          ) : (
            <Row>
              {stores &&
                stores.map((store) => {
                  return (
                    <Col lg={4} key={store._id}>
                      <Stores store={store} />
                    </Col>
                  );
                })}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default StoresList;
