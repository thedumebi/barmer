import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Items from "./Items";
import { useSelector } from "react-redux";

const Stores = ({ store }) => {
  const userDetails = useSelector((state) => state.userDetail);
  const { user } = userDetails;

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
        {store.items.map((item) => (
          <Items key={item.id} item={item} />
        ))}
      </div>
      <Link to={`/store/${store._id}`}>
        <Button classname="btn-dark" type="button">
          Visit Store
        </Button>
      </Link>
      {user && user._id === store.user._id && (
        <Link to={`/user/${user._id}/additem`}>
          <Button classname="btn-dark" type="button">
            Add a new item
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Stores;
