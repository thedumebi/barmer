const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  name: String,
  phone_number: String,
  items: Array,
  incoming_requests: Array,
  outgoing_requests: Array,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (_id, done) {
  User.findById(_id, function (err, user) {
    done(err, user);
  });
});

module.exports = User;