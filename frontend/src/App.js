import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./screens/Login";
import Home from "./screens/Home";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Settings from "./screens/Settings";
import Profile from "./screens/Profile";
import RegisterStore from "./screens/RegisterStore";
import Store from "./screens/Store";
import StoresList from "./screens/StoresList";
import StoreEdit from "./screens/StoreEditScreen";
import ItemsList from "./screens/ItemsList";
import Item from "./screens/Item";
import NewItem from "./screens/NewItem";
import ItemEdit from "./screens/ItemEditScreen";
import Favorites from "./screens/Favorites";
import NotFound from "./screens/NotFound";
import RequestsMade from "./screens/RequestsMade";
import RequestsReceived from "./screens/RequestsReceived";

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
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/registerstore" component={RegisterStore} />
            <Route exact path="/stores" component={StoresList} />
            <Route exact path="/store/:id" component={Store} />
            <Route exact path="/store/:id/edit" component={StoreEdit} />
            <Route exact path="/items" component={ItemsList} />
            <Route exact path="/items/newitem?store=:id" component={NewItem} />
            <Route exact path="/items/newitem" component={NewItem} />
            <Route exact path="/item/:id/edit" component={ItemEdit} />
            <Route path="/item/:id" component={Item} />
            <Route exact path="/favorites" component={Favorites} />
            <Route exact path="/requests-sent" component={RequestsMade} />
            <Route
              exact
              path="/requests-received"
              component={RequestsReceived}
            />
            <Route exact path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
