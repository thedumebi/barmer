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
import {
  Favorite,
  FavoriteBorder,
  PostAdd,
  Edit,
  Delete,
  ExposureRounded,
  BorderColor,
  LaunchRounded,
} from "@material-ui/icons";
import { Fab } from "@material-ui/core";

const Items = ({ item }) => {
  const url = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { success, error } = itemDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && userInfo) {
      dispatch(getUserDetails(userInfo._id));
    }
    if (success) {
      history.push("/profile");
    }
  }, [user, dispatch, userInfo, history, success]);

  const deleteHandler = () => {
    if (window.confirm("This is an ireversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE ITEM?")) {
        dispatch(deleteItem(item._id, item.store._id));
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
          {error && <Message variant="error">{error}</Message>}
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
                {/* edit item button */}
                <Link to={`/item/${item._id}/edit`}>
                  <Fab
                    style={{
                      backgroundColor: "#343a40",
                      borderColor: "#343a40",
                    }}
                  >
                    <BorderColor style={{ color: "white" }} />
                  </Fab>
                </Link>

                {/* delete button */}
                <Fab
                  onClick={deleteHandler}
                  style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
                >
                  <Delete style={{ color: "white" }} />
                </Fab>
              </>
            )}

          {/* favorite button */}
          {item._id &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            !user.favorites.includes(
              user.favorites.find((el) => el._id === item._id)
            ) && (
              <Fab
                onClick={favorite}
                style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
              >
                <FavoriteBorder
                  style={{ color: "#d60b0b" }}
                  fontSize="default"
                />
              </Fab>
            )}

          {/* unfavorite button */}
          {item._id &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            user.favorites.includes(
              user.favorites.find((el) => el._id === item._id)
            ) && (
              <Fab
                onClick={unfavorite}
                style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
              >
                <Favorite style={{ color: "#d60b0b" }} fontSize="default" />
              </Fab>
            )}

          {/* make request */}
          {item._id &&
            location.pathname === url.url &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            !user.outgoingRequests.includes(
              user.outgoingRequests
                .filter((el) => el.status === "pending")
                .find((el) => el.item._id === item._id)
            ) && (
              <Link to={`${url.url}/request`}>
                <Fab
                  style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
                >
                  <PostAdd style={{ color: "white" }} />
                </Fab>
              </Link>
            )}

          {/* edit request */}
          {item._id &&
            location.pathname === url.url &&
            url.path === "/item/:id" &&
            user &&
            user._id !== item.store.owner._id &&
            user.outgoingRequests.includes(
              user.outgoingRequests
                .filter((el) => el.status === "pending")
                .find((el) => el.item._id === item._id)
            ) && (
              <Link to={`${url.url}/edit-request`}>
                <Fab
                  style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
                >
                  <Edit style={{ color: "white" }} />
                </Fab>
              </Link>
            )}

          {/* visit item button */}
          {item._id &&
            (url.path === "/store/:id" ||
              url.path === "/favorites" ||
              url.path === "/items") && (
              <Link to={`/item/${item._id}`}>
                <Fab
                  style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
                >
                  <LaunchRounded style={{ color: "white" }} />
                </Fab>
              </Link>
            )}

          {/* add/remove item quantity */}
          {item.store &&
            user &&
            user._id === item.store.owner._id &&
            url.path === "/item/:id" && (
              <Link to={`/item/${item._id}/quantity`}>
                <Fab
                  style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
                >
                  <ExposureRounded style={{ color: "white" }} />
                </Fab>
              </Link>
            )}

          {!user && url.path === "/item/:id" && (
            <Link to={`/login?redirect=/item/${item._id}`}>
              <Fab
                style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
              >
                <PostAdd style={{ color: "white" }} />
              </Fab>
            </Link>
          )}

          {!user && url.path === "/item/:id" && (
            <Link to={`/login?redirect=/item/${item._id}`}>
              <Fab
                style={{ backgroundColor: "#343a40", borderColor: "#343a40" }}
              >
                <FavoriteBorder style={{ color: "white" }} fontSize="default" />
              </Fab>
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default Items;
