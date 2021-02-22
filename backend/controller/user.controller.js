const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const User = require("../models/users.models");

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const usernameRegex = /^[a-zA-Z][\w-]+$/;
  let criteria;
  if (emailRegex.test(input)) {
    criteria = { email: input };
  } else if (usernameRegex.test(input)) {
    criteria = { username: input };
  }

  const user = await User.findOne(criteria);

  if (user) {
    if (await user.matchPassword(password)) {
      const { password, ...otherKeys } = user._doc;
      res.status(200).json({
        ...otherKeys,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    if (criteria.email) {
      res.status(401);
      throw new Error("Invalid email");
    } else if (criteria.username) {
      res.status(401);
      throw new Error("Invalid username");
    }
  }
});

// @desc Register a new user
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phoneNumber, email, username, password } = req.body;

  const [lastUser] = await User.find().sort({ created_at: -1 }).exec();
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Sorry, that username is taken");
  }

  const user = await User.create({
    id: lastUser ? lastUser.id + 1 : 1,
    name,
    email,
    password,
    username,
    phoneNumber,
  });

  if (user) {
    const newUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      ...newUser._doc,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/:id || GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  let user;
  if (req.path == "/profile") {
    user = await User.findById(req.user._id).select("-password");
  } else if (req.params.id) {
    user = await User.findById(req.params.id).select("-password");
  }

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PATCH /api/user/:id || PATCH /api/user/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  let user;
  if (req.path == "/profile") {
    user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { runValidators: true, new: true }
    );
  } else if (req.params.id) {
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { runValidators: true, new: true }
    );
  }

  if (user) {
    const { password, ...otherKeys } = user._doc;
    res.status(200).json(otherKeys);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ created_at: -1 });
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateProfile,
  getUsers,
  deleteUser,
};
