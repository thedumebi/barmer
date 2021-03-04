import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../actions/item.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Items from "../components/Items";

const ItemsList = ({ history }) => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  const itemsList = useSelector((state) => state.itemList);
  const { loading, error, items: itemList } = itemsList;

  useEffect(() => {
    if (!itemList) {
      dispatch(getItems());
    }
    setItems(itemList);
  }, [dispatch, itemList]);

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
          {items && items.length === 0 ? (
            <h1 className="big-heading">Items are coming soon ;)</h1>
          ) : (
            <Row>
              {items &&
                items.map((item) => {
                  return (
                    <Col lg={4} key={item._id}>
                      <Items item={item} />
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

export default ItemsList;
