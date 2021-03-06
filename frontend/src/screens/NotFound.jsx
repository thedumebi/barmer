import React from "react";
import { Button, Col, Row, Image } from "react-bootstrap";

const NotFound = ({ history }) => (
  <div>
    <Row>
      <Col lg={6}>
        <h1 className="big-heading">Sorry, you seem to be lost :(</h1>
        <Button
          className="btn btn-dark my-3 big-heading"
          onClick={() => history.goBack()}
        >
          Back
        </Button>
      </Col>
      <Col lg={6}>
        <Image src="/images/llama.svg" className="home-image" />
      </Col>
    </Row>
  </div>
);

export default NotFound;
