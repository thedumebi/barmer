const asyncHandler = require("express-async-handler");
const Carousel = require("../models/carousel.model");

const getCarousels = asyncHandler(async (req, res) => {
  const carousels = await Carousel.find().sort({ createdAt: -1 }).exec();
  if (carousels) {
    res.json(carousels);
  } else {
    res.status(404);
    throw new Error("No carousels found");
  }
});

const getCarouselById = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findById(req.params.id);
  if (carousel) {
    res.json(carousel);
  } else {
    res.status(404);
    throw new Error("Carousel not found");
  }
});

const createCarousel = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, text, image } = req.body;
  const carouselExists = await Carousel.findOne({ name });
  if (carouselExists) {
    res.status(404);
    throw new Error("Carousel with that name already exists");
  }

  const carousel = await Carousel.create({
    name,
    text,
    image,
  });

  if (carousel) {
    res.status(200).json(carousel);
  }
});

const updateCarousel = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).exec();

  if (carousel) {
    res.json(carousel);
  } else {
    res.status(404);
    throw new Error("Carousel item not found");
  }
});

const deleteCarousel = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      res.status(200).json({ message: "Carousel Deleted" });
    } else {
      res.status(404);
      throw new Error("Carousel delete failed.");
    }
  });
  if (!carousel) {
    res.status(404);
    throw new Error("Carousel not found");
  }
});

module.exports = {
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
};
