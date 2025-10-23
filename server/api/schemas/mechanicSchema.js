const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  idnumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  securityQuestion: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: false,
    default: "mechanic",
  },
});

module.exports = mongoose.model("Mechanic", mechanicSchema);
