import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const DarkModeButton = ({ mode }) => {
  const [check, setCheck] = useState({
    state: document.body.classList.contains("dark-theme") ? true : false,
    text: "",
  });

  useEffect(() => {
    window.onload = () => {
      if (document.body.classList.contains("light-theme")) {
        setCheck({ state: false, text: "light" });
      } else if (document.body.classList.contains("dark-theme")) {
        setCheck({ state: true, text: "dark" });
      }
    };
  }, []);

  const toggleButton = (event) => {
    let theme;
    if (mode === "light") {
      document.body.classList.toggle("light-theme");
      document.body.classList.toggle("dark-theme");
      theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    } else {
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");
      theme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";
    }
    document.cookie = `theme=${theme}`;
  };

  const handleChange = (event) => {
    if (document.body.classList.contains("light-theme")) {
      setCheck({ state: false, text: "light" });
    } else if (document.body.classList.contains("dark-theme")) {
      setCheck({ state: true, text: "dark" });
    }
  };

  return (
    <div className="dark-btn">
      <Form.Text className="dark-mode-text">
        {check.text}
        <br />
        mode
      </Form.Text>
      <Form.Label className="switch">
        <Form.Control
          type="checkbox"
          checked={check.state}
          onChange={handleChange}
          onClick={toggleButton}
        />
        <span className="slider round"></span>
      </Form.Label>
    </div>
  );
};

export default DarkModeButton;
