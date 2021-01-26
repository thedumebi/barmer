require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const { createUser, loginUser } = require("./controller/user");
const { connectDB } = require("./utils/database.utils");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "..", "/client/build")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/uploads/images`);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  },
});
const upload = multer({
  storage: storage,
});

connectDB();

app.post("/api/register", function (req, res) {
  createUser(req, res);
});

app.post("/api/login", function (req, res) {
  loginUser(req, res);
});

app.get("/api/checkAuthentication", function (req, res) {
  if (req.isAuthenticated()) {
    const authenticated = Boolean(req.user !== "undefined");
    res.status(200).json({ user: req.user, authenticated });
  } else {
    const authenticated = Boolean(req.user === "undefined");
    res.send({ user: req.user, authenticated });
  }
});

app.get("/api/logout", function (req, res) {
  req.logout();
  res.status(200).json({ status: res.statusMessage });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function () {
  console.log(`Server started successfully on port ${port}`);
});
