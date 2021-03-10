import React, { useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Items from "./Items";
import { useDispatch, useSelector } from "react-redux";
import { deleteStore } from "../actions/store.actions";
import Message from "./Message";

const Stores = ({ store }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const storeDelete = useSelector((state) => state.storeDelete);
  const { success, error } = storeDelete;

  const dispatch = useDispatch();

  const deleteHandler = (event) => {
    if (window.confirm("This is an irreversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE STORE?")) {
        dispatch(deleteStore(store._id));
      }
    }
  };

  useEffect(() => {
    if (success) {
      history.push("/profile");
    }
  }, [history, success]);

  return (
    <div className="case">
      {error && <Message variant="danger">{error}</Message>}
      {store.image && (
        <div className="heading">
          <Link to={`/store/${store._id}`}>
            <img src={store.image} alt={store.name} />
          </Link>
        </div>
      )}
      <div
        className="content"
        style={{ height: url.path === "/store/:id" && "auto" }}
      >
        <h1 className="sub-heading">{store.name}</h1>
        <small>{store.category}</small>
        <p>Description: {store.description}</p>
        {store.items &&
          store.items.map((item) => <Items key={item.id} item={item} />)}
      </div>

      {store._id &&
        url.path === "/store/:id" &&
        userInfo &&
        userInfo._id === store.owner._id && (
          <>
            <Button className="btn-dark" type="button" onClick={deleteHandler}>
              Delete Store
            </Button>

            <Link to={`/store/${store._id}/edit`}>
              <Button className="btn-dark" type="button">
                Edit Store
              </Button>
            </Link>
          </>
        )}

      {store._id && url.path !== "/store/:id" && (
        <Link to={`/store/${store._id}`}>
          <Button className="btn-dark" type="button">
            Visit Store
          </Button>
        </Link>
      )}

      {store.owner &&
        userInfo &&
        userInfo._id === store.owner._id &&
        url.path === "/store/:id" && (
          <Link
            to={
              url.path === "/stores"
                ? `/items/newitem?store=${store._id}`
                : `/items/newitem`
            }
          >
            <Button className="btn-dark" type="button">
              Add a new item
            </Button>
          </Link>
        )}
    </div>
  );
};

export default Stores;
