const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: String,
  image: String,
  quantity: Number,
  store: Object,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
