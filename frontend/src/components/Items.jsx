import React, { useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  favoriteItem,
  unFavoriteItem,
} from "../actions/item.actions";
import Message from "../components/Message";

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

  const favorite = () => {
    dispatch(favoriteItem(item._id, userInfo._id));
  };

  const unfavorite = () => {
    dispatch(unFavoriteItem(item._id, userInfo._id));
  };

  const [overlay, setOverlay] = useState({
    src: "",
    display: "none",
    status: false,
  });

  const overlayHandler = (value) => {
    setOverlay({ ...overlay, src: value, display: "block", status: true });
  };

  return (
    <div className="case">
      {url.path === "/item/:id" && overlay.status ? (
        <div
          id="overlay"
          onClick={() =>
            setOverlay({ src: "", status: false, display: "none" })
          }
          style={{
            textAlign: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            padding: "2%",
            zIndex: 10,
            display: overlay.display,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Message variant="info">Tap anywhere on the screen to exit</Message>
          <Image
            src={overlay.src}
            alt={item.name}
            style={{
              border: "3px solid black",
              height: "80%",
            }}
          />
        </div>
      ) : (
        <>
          {url.path === "/item/:id" && (
            <Message variant="info">
              Tap the image tile to view the full item image
            </Message>
          )}
          {item.image && (
            <div className="heading">
              {url.path === "/item/:id" ? (
                <Image
                  src={`/${item.image}`}
                  alt={item.name}
                  onClick={() => overlayHandler(`/${item.image}`)}
                />
              ) : (
                <Link to={`/item/${item._id}`}>
                  <Image src={`/${item.image}`} alt={item.name} />
                </Link>
              )}
            </div>
          )}
          <div className="content">
            <h1 className="sub-heading">{item.name}</h1>
            {item.store && <small>{item.store.category}</small>}
            <p>There are {item.quantity} left in stock</p>
          </div>

          {item._id &&
            url.path === "/item/:id" &&
            userInfo &&
            userInfo._id === item.store.owner._id && (
              <>
                <Link to={`/item/${item._id}/edit`}>
                  <Button className="btn-dark" type="button">
                    Edit Item
                  </Button>
                </Link>
                <Button
                  className="btn-dark"
                  type="button"
                  onClick={deleteHandler}
                >
                  Delete Item
                </Button>
              </>
            )}

          {item._id &&
            url.path === "/item/:id" &&
            userInfo &&
            userInfo._id !== item.store.owner._id &&
            !userInfo.favorites.includes(
              userInfo.favorites.find((el) => el._id === item._id)
            ) && (
              <>
                <Button className="btn-dark" onClick={favorite}>
                  Favorite
                </Button>
              </>
            )}

          {item._id &&
            url.path === "/item/:id" &&
            userInfo &&
            userInfo._id !== item.store.owner._id &&
            userInfo.favorites.includes(
              userInfo.favorites.find((el) => el._id === item._id)
            ) && (
              <>
                <Button className="btn-dark" onClick={unfavorite}>
                  UnFavorite
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

          {item._id && url.path === "/store/:id" && (
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
        </>
      )}
    </div>
  );
};

export default Items;
