import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Items from "../components/Items";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetails } from "../actions/item.actions";
import { Button } from "react-bootstrap";

const Item = ({ history, match }) => {
  const [item, setItem] = useState({});

  const dispatch = useDispatch();

  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item: itemDetail } = itemDetails;

  useEffect(() => {
    if (!itemDetail || !itemDetail.name) {
      dispatch(getItemDetails(match.params.id));
    }
    setItem({ ...itemDetail });
  }, [dispatch, match, itemDetail]);

  console.log(item);

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
        <Items item={item} />
      )}
    </div>
  );
};
export default Item;
