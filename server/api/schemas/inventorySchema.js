const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  partName: {
    type: String,
    required: true,
  },
  partCode: {
    type: String,
    required: true,
    unique: true,
  },
  partImage: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;