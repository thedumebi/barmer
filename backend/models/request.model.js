const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: Object,
  itemQuantity: Number,
  swapItem: Object,
  swapItemQuantity: Number,
  status: {
    type: String,
    default: "pending",
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = { Request, requestSchema };
