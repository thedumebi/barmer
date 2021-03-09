import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  useHistory,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  favoriteItem,
  unFavoriteItem,
} from "../actions/item.actions";
import Message from "../components/Message";
import Request from "./Request";
import { getUserDetails } from "../actions/user.actions";

const Items = ({ item }) => {
  const url = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails(userInfo._id));
    }
  }, [user, dispatch, userInfo]);

  const deleteHandler = () => {
    if (window.confirm("This is an ireversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE ITEM?")) {
        dispatch(deleteItem(item._id, item.store._id));
        history.push("/profile");
      }
    }
  };

  const favorite = () => {
    dispatch(favoriteItem(item._id, user._id));
  };

  const unfavorite = () => {
    dispatch(unFavoriteItem(item._id, user._id));
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

          <hr />

          <Route exact path={`${url.path}/request`}>
            <Request item={item} user={user && user} />
          </Route>

          <Route exact path={`${url.path}/edit-request`}>
            <Request item={item} user={user && user} />
          </Route>

          {item._id &&
            url.path === "/item/:id" &&
            user &&
            user._id === item.store.owner._id && (
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
            user &&
            user._id !== item.store.owner._id &&
            !user.favorites.includes(
              user.favorites.find((el) => el._id === item._id)
            ) && (
              <Button className="btn-dark" onClick={favorite}>
                Favorite
              </Button>
            )}

          {item._id &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            user.favorites.includes(
              user.favorites.find((el) => el._id === item._id)
            ) && (
              <Button className="btn-dark" onClick={unfavorite}>
                UnFavorite
              </Button>
            )}

          {item._id &&
            location.pathname === url.url &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            !user.outgoingRequests.includes(
              user.outgoingRequests.find((el) => el.item._id === item._id)
            ) && (
              <Link to={`${url.url}/request`}>
                <Button className="btn-dark">Make Request</Button>
              </Link>
            )}

          {item._id &&
            location.pathname === url.url &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            user.outgoingRequests.includes(
              user.outgoingRequests.find((el) => el.item._id === item._id)
            ) && (
              <Link to={`${url.url}/edit-request`}>
                <Button className="btn-dark">Edit Request</Button>
              </Link>
            )}

          {item._id &&
            (url.path === "/store/:id" ||
              url.path === "/favorites" ||
              url.path === "/items") && (
              <Link to={`/item/${item._id}`}>
                <Button className="btn-dark" type="button">
                  View Item
                </Button>
              </Link>
            )}

          {item.store &&
            user &&
            user._id === item.store.owner._id &&
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
