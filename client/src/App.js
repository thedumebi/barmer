import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const user = await axios.get("/api/checkAuthentication", {
        withCredentials: true,
      });
      setUser(user.data.user);
      setLoggedIn(user.data.authenticated);
    };
    getUser();
  }, []);

  function logged(value) {
    setLoggedIn(value);
  }

  return (
    <Router>
      <div className="App">
        <NavBar user={user} />
        <Switch>
          <Route exact path="/">
            <Home loggedIn={loggedIn} />
          </Route>
          <Route exact path="/register">
            <Login isRegistered={false} loggedIn={logged} />
          </Route>
          <Route exact path="/login">
            <Login isRegistered={true} loggedIn={logged} />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
