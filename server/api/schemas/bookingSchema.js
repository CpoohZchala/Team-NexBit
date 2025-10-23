const mongoose = require("mongoose");

const workItemSchema = new mongoose.Schema({
  partCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  warranty: {
    type: String,
    required: false,
  },
  qty: {
    type: Number,
    required: true,
  },
  unitAmount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema({
  vehiclemake: {
    type: String,
    required: true,
  },
  vehicletype: {
    type: String,
    required: true,
  },
  vehiclenumber: {
    type: String,
    required: true,
  },
  manufecturedyear: {
    type: String,
    required: true,
  },
  preferreddate: {
    type: String,
    required: true,
  },
  preferredtime: {
    type: String,
    required: true,
  },
  vehicleownername: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mechanic",
    required: true,
  },
  isAccepted: {
    type: String,
    required: false,
    default: "pending",
  },
  works: {
    type: [workItemSchema],
    required: false,
    default: [],
  },
  netTotal: {
    type: Number,
    required: false,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
