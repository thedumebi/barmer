const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const requestSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  comment: String,
  user: Object,
  status: String,
});

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  name: String,
  phoneNumber: String,
  items: Array,
  incomingRequests: [requestSchema],
  outgoingRequests: [requestSchema],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
