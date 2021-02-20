import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            Copyright &copy; Barmer | <a href="/">FAQ</a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pb-3">
            Designed by <a href="https:/dmb100days.herokuapp.com">DMB</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
