require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const path = require("path");
const colors = require("colors");
const multer = require("multer");
const connectDB = require("./config/database.utils");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use("/api/users", userRoutes);

//Make uploads folder static
app.use("/backend/uploads", express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(__dirname + "/build"));

  app.get("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));
} else {
  app.get("/", (req, res) => {
    res.send("API is running ....".cyan.bold);
  });
}

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//     credentials: true,
//   })
// );

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${__dirname}/public/uploads/images`);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname);
//   },
// });
// const upload = multer({
//   storage: storage,
// });

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
