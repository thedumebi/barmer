import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./screens/Login";
import Home from "./screens/Home";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Login} />
          <Route exact path="/login" component={Login} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
