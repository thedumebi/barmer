const mongoose = require("mongoose");

const carouselSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Carousel = mongoose.model("Carousel", carouselSchema);

module.exports = Carousel;
