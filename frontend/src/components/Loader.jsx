import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner className="loader" animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default Loader;
