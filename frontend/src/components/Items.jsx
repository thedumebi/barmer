import React from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem } from "../actions/item.actions";

const Items = ({ item }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const deleteHandler = () => {
    if (window.confirm("This is an ireversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE ITEM?")) {
        dispatch(deleteItem(item._id, item.store._id));
        history.push("/profile");
      }
    }
  };

  return (
    <div className="case">
      {item.image && (
        <div
          className="heading"
          style={{ height: url.path === "/item/:id" && "auto" }}
        >
          <Link to={`/item/${item._id}`}>
            <Image src={`/${item.image}`} alt={item.name} />
          </Link>
        </div>
      )}
      <div className="content">
        <h1 className="sub-heading">{item.name}</h1>
        {item.store && <small>{item.store.category}</small>}
        <p>There are {item.quantity} left in stock</p>
      </div>

      {item._id && url.path === "/item/:id" && (
        <>
          <Link to={`/item/${item._id}/edit`}>
            <Button className="btn-dark" type="button">
              Edit Item
            </Button>
          </Link>
          <Button className="btn-dark" type="button" onClick={deleteHandler}>
            Delete Item
          </Button>
        </>
      )}

      {item._id && url.path === "/items" && (
        <Link to={`/item/${item._id}`}>
          <Button className="btn-dark" type="button">
            View Item
          </Button>
        </Link>
      )}

      {item.store &&
        userInfo &&
        userInfo._id === item.store.owner._id &&
        url.path === "/item/:id" && (
          <Link to={`/item/${item._id}/quantity`}>
            <Button className="btn-dark" type="button">
              Add/Remove
            </Button>
          </Link>
        )}
    </div>
  );
};

export default Items;
