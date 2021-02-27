import React from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Items from "./Items";
import { useDispatch, useSelector } from "react-redux";
import { deleteStore } from "../actions/store.actions";

const Stores = ({ store }) => {
  const url = useRouteMatch();
  const history = useHistory();
  console.log(store);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const deleteHandler = (event) => {
    if (window.confirm("This is an irreversible act. Are you sure?")) {
      if (window.confirm("Last warning. Delete?")) {
        dispatch(deleteStore(store._id));
        history.push("/profile");
      }
    }
  };

  return (
    <div className="case">
      {store.image && (
        <div className="heading">
          <Link to={`/store/${store._id}`}>
            <img src={store.image} alt={store.name} />
          </Link>
        </div>
      )}
      <div className="content">
        <h1 className="sub-heading">{store.name}</h1>
        <small>{store.category}</small>
        <p>Description: {store.description}</p>
        {store.items &&
          store.items.map((item) => <Items key={item.id} item={item} />)}
      </div>

      {store._id && url.path === "/store/:id" && (
        <Button className="btn-dark" type="button" onClick={deleteHandler}>
          Delete Store
        </Button>
      )}

      {store._id && url.path === "/store/:id" && (
        <Link to={`/store/${store._id}/edit`}>
          <Button className="btn-dark" type="button">
            Edit Store
          </Button>
        </Link>
      )}

      {store._id && url.path !== "/store/:id" && (
        <Link to={`/store/${store._id}`}>
          <Button className="btn-dark" type="button">
            Visit Store
          </Button>
        </Link>
      )}

      {store.owner && userInfo && userInfo._id === store.owner._id && (
        <Link to={`/items/additem`}>
          <Button className="btn-dark" type="button">
            Add a new item
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Stores;
