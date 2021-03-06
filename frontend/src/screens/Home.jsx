import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Carousel, Col, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getItemOfTheDay } from "../actions/item.actions";
import { listCarousels } from "../actions/carousel.actions";

const Home = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const itemOfTheDay = useSelector((state) => state.itemOfTheDay);
  const { loading, error, item } = itemOfTheDay;

  const dispatch = useDispatch();

  const [carousel, setCarousel] = useState({
    signup: {
      image: "/images/llama.svg",
      text: userInfo ? "Visit profile" : "Register and start trading",
      link: userInfo ? "/profile" : "/register",
    },
    itemOfTheDay: undefined,
  });

  const carouselList = useSelector((state) => state.carouselList);
  const { carousels } = carouselList;
  const adminCarousels = {};
  if (carousels && carousels.length !== 0) {
    for (let i = 0; i < carousels.length; i++) {
      adminCarousels[carousels[i].name] = {
        image: carousels[i].image,
        text: carousels[i].text,
      };
    }
    Object.assign(carousel, adminCarousels);
  }

  useEffect(() => {
    if (!item) {
      dispatch(getItemOfTheDay());
    } else {
      setCarousel((prevValues) => {
        return {
          ...prevValues,
          itemOfTheDay: {
            image: `/${item.image}`,
            text: `${item.name} (item of the day)`,
            link: `/item/${item._id}`,
          },
        };
      });
    }

    dispatch(listCarousels());
  }, [dispatch, item]);

  return (
    <div>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {userInfo ? (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome back {userInfo.username}</h1>
            <p>Exchange goods in a simple way</p>
            <Link to="/items">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      ) : (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome to our store.</h1>
            <p>Exchange goods in a simple way</p>
            <Link to="/login">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      )}
      <Carousel interval={3000} className="home-carousel">
        {Object.keys(carousel)
          .filter((item) => carousel[item] !== undefined)
          .map((item, index) => (
            <Carousel.Item key={index}>
              {carousel[item].link ? (
                <Link to={carousel[item].link}>
                  {carousel[item].image && (
                    <Image
                      src={carousel[item].image}
                      className="d-block w-100"
                      alt="carousel image"
                    />
                  )}
                </Link>
              ) : (
                carousel[item].image && (
                  <Image
                    src={carousel[item].imsge}
                    className="d-block w-100"
                    alt="carousel image"
                  />
                )
              )}
              <Carousel.Caption>
                <h4>{carousel[item].text}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default Home;
