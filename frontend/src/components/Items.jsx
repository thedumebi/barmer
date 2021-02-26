import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Items = ({ item }) => {
  return (
    <div className="case">
      {item.image && (
        <div className="heading">
          <Link to={`/item/${item._id}`}>
            <img src={item.image} alt={item.name} />
          </Link>
        </div>
      )}
      <div className="content">
        <h1 className="sub-heading">{item.name}</h1>
        <p>There are {item.quantity} left in stock</p>
      </div>
      <Link to={`/item/${item._id}`}>
        <Button classname="btn-dark" type="button">
          View Item
        </Button>
      </Link>
    </div>
  );
};

export default Items;
