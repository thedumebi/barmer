const express = require("express");
const {
  authUser,
  registerUser,
  getUsers,
  updateProfile,
  getUserProfile,
  deleteUser,
} = require("../controller/user.controller");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.route("/profile").get(getUserProfile).patch(protect, updateProfile);
router
  .route("/:id")
  .get(getUserProfile)
  .patch(updateProfile)
  .delete(protect, admin, deleteUser);

module.exports = router;
