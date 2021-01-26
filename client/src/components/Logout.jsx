import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

function Logout() {
  const history = useHistory();

  function handleClick() {
    axios
    .get("/api/logout", { withCredentials: true })
    .then((res) => {
      if (res.data.status === "ok") {
        history.push("/");
      }
    });
  }

  return <Button className="btn-lg btn-dark" onClick={handleClick}>Log Out?</Button>;
}

export default Logout;