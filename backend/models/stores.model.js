const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: String,
  category: String,
  description: String,
  items: Array,
  owner: Object,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
