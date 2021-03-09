import React from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteRequest } from "../actions/request.actions";
import Loader from "./Loader";

const RequestCard = ({
  requestId,
  item,
  itemQuantity,
  swapItem,
  swapItemQuantity,
  status,
}) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user } = userDetails;

  const dispatch = useDispatch();

  const deleteHandler = (event) => {
    if (window.confirm("This is an irreversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE REQUEST?")) {
        dispatch(deleteRequest(requestId));
        history.push("/profile");
      }
    }
  };

  return (
    <div className="request">
      {loading && <Loader />}
      <i
        className="fas fa-arrows-alt-h fa-2x"
        style={{ margin: "auto 46%" }}
      ></i>
      <br />
      <div className="section">
        {item && item.image && (
          <div className="heading">
            <Link to={`/item/${item._id}`}>
              <Image src={`/${item.image}`} alt={item.name} />
            </Link>
          </div>
        )}
        <div className="content">
          <h1 className="sub-heading">{item.name}</h1>
          <small>{item.store.category}</small>
          <p>Number requested: {itemQuantity}</p>
        </div>
      </div>

      <div className="section">
        {swapItem && swapItem.image && (
          <div className="heading">
            <Link to={`/item/${item._id}`}>
              <Image src={`/${swapItem.image}`} alt={swapItem.name} />
            </Link>
          </div>
        )}
        <div className="content">
          <h1 className="sub-heading">{swapItem.name}</h1>
          <small>{swapItem.store.category}</small>
          <p>Number Offered: {swapItemQuantity}</p>
        </div>
      </div>

      <br />

      {status && <p style={{ fontWeight: 700 }}>Status: {status}</p>}
    </div>
  );
};

export default RequestCard;
