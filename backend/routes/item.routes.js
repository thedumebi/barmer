const express = require("express");
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  favoriteItem,
  unfavoriteItem,
  addItem,
  removeItem,
  deleteItem,
  getItemOfTheDay,
} = require("../controller/items.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/").get(getItems).post(protect, createItem);
router.get("/item", getItemOfTheDay);
router.post("/:id/favorite", protect, favoriteItem);
router.post("/:id/unfavorite", protect, unfavoriteItem);
router.post("/:id/add", protect, addItem);
router.post("/:id/remove", protect, removeItem);
router
  .route("/:id")
  .get(getItemById)
  .patch(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
