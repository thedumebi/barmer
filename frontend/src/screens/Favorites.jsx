import React, { useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Items from "../components/Items";

const Favorites = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/favorites");
    }
  }, [history, userInfo]);

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {userInfo && userInfo.favorites.length === 0 ? (
            <>
              <h1 className="big-heading">You don't have any favorite items</h1>
              <Link to="/items">
                <Button className="btn btn-lg btn-dark">Get Started</Button>
              </Link>
            </>
          ) : (
            <Row>
              {userInfo &&
                userInfo.favorites.map((item) => {
                  return (
                    <Col lg={4} key={item._id}>
                      <Items item={item} />
                    </Col>
                  );
                })}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
