const passport = require("passport");
const User = require("../models/users.models");

exports.createUser = async function (req, res) {
  try {
    const [user] = await User.find().sort({ created_at: -1 }).exec();
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          console.log(res);
        } else {
          user.name = req.body.fname + " " + req.body.lname;
          user.phone_number = req.body.phone;
          user.save(function (err) {
            if (!err) {
              passport.authenticate("local")(req, res, function () {
                res.send({ status: res.statusMessage, user: req.user });
              });
            }
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.send({ status: res.statusMessage });
  }
};

exports.loginUser = async function (req, res) {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(res);
      }
      passport.authenticate("local")(req, res, function () {
        res.send({ status: res.statusMessage, user: req.user });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
