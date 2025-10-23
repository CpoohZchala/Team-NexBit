const Admin = require("../schemas/adminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../schemas/bookingSchema");
const Notification = require("../schemas/notificationSchema");
const mongoose = require("mongoose");

// Admin login
exports.postAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if input fields are empty
  if (!identifier || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Empty input fields",
    });
  }

  try {
    // Find the admin by username or email
    const data = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (data) {
      const hashedPassword = data.password;

      // Compare the provided password with the stored hashed password
      const result = await bcrypt.compare(password, hashedPassword);

      if (result) {
        // Generate JWT token
        const token = jwt.sign({ id: data._id }, "your_jwt_secret", {
          expiresIn: "1h",
        });

        return res.status(200).json({
          status: "SUCCESS",
          message: "Login successful",
          token: token,
          data: data,
        });
      } else {
        return res.status(401).json({
          status: "FAILED",
          message: "Invalid password",
        });
      }
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Invalid username or email",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred during login",
    });
  }
};

// Get admin by username or email
exports.getAdmin = async (req, res) => {
  const { identifier } = req.params;

  try {
    // Find admin by either username or email
    const adminData = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (adminData) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Admin data fetched successfully",
        data: adminData,
      });
    } else {
      res.status(404).json({
        status: "FAILED",
        message: "Admin not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching admin data",
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("userId")
      .populate("mechanicId");

    if (allBookings) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Admin data fetched successfully",
        data: allBookings,
      });
    } else {
      res.status(404).json({
        status: "FAILED",
        message: "Booking not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching admin data",
    });
  }
};

exports.assignMechanic = async (req, res) => {
  const bookingId = req.params.bookingId;
  const { mechanicId } = req.body;

  try {
    const mechanicObjectId = new mongoose.Types.ObjectId(mechanicId);

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { mechanicId: mechanicObjectId, isAccepted: 'pending' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    const newNotification = new Notification({
      topic: "Booking",
      message: "Booking created successfully",
      recieverId: booking.userId,
      mechanicId: mechanicObjectId,
      bookingId: booking._id,
    });
    await newNotification.save();

    res.status(200).send('Booking updated successfully');
  } catch (error) {
    console.error('Error during updating booking', error);
    res.status(500).send('Internal Server Error');
  }
};
