const express = require("express");
const {
  authUser,
  registerUser,
  getUsers,
  updateProfile,
  getUserProfile,
  deleteUser,
} = require("../controller/user.controller");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
  .route("/:id")
  .get(protect, getUserProfile)
  .patch(protect, updateProfile)
  .delete(protect, deleteUser);
module.exports = router;
