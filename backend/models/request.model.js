const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: Object,
  itemQuantity: Number,
  itemStore: Object,
  swapItem: Object,
  swapItemQuantity: Number,
  swapItemStore: Object,
  status: {
    type: String,
    default: "pending",
  },
  comment: String,
});

const Request = mongoose.model("Request", requestSchema);

module.exports = { Request, requestSchema };
