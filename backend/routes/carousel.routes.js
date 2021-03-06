const express = require("express");
const { admin, protect } = require("../middleware/auth.middleware");
const {
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} = require("../controller/carousel.controller");
const router = express.Router();

router.route("/").get(getCarousels).post(protect, admin, createCarousel);
router
  .route("/:id")
  .get(protect, admin, getCarouselById)
  .patch(protect, admin, updateCarousel)
  .delete(protect, admin, deleteCarousel);

module.exports = router;
