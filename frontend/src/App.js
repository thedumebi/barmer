import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./screens/Login";
import Home from "./screens/Home";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Settings from "./screens/Settings";

const App = () => {
  const getCookie = (name) => {
    const theme = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(theme) === 0) {
        return cookie.substring(theme.length, cookie.length);
      }
    }
    return "";
  };

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const currentTheme = getCookie("theme");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (currentTheme === "light") {
      document.body.classList.toggle("light-theme");
      setTheme("dark");
    } else if (currentTheme === "dark") {
      document.body.classList.toggle("dark-theme");
      setTheme("light");
    } else if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark-theme");
      setTheme("light");
    } else {
      document.body.classList.toggle("dark-theme");
      setTheme("light");
    }
  }, []);

  return (
    <Router>
      <Header mode={theme} />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/settings" component={Settings} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
