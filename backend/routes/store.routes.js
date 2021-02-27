const express = require("express");
const {
  getStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controller/store.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(getStores).post(protect, createStore);
router
  .route("/:id")
  .get(getStoreById)
  .patch(protect, updateStore)
  .delete(protect, deleteStore);

module.exports = router;
