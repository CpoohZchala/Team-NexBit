const Booking = require("../schemas/bookingSchema");
const User = require("../schemas/userSchema"); // Import the User model
const Notification = require("../schemas/notificationSchema");
const Inventory = require("../schemas/inventorySchema");

// Create a new booking
exports.createBooking = async (req, res) => {
  const {
    email,
    model,
    mobilenumber,
    vehicleownername,
    vehiclemake,
    vehicletype,
    vehiclenumber,
    manufecturedyear,
    message,
    preferreddate,
    preferredtime,
    userId,
    mechanicId,
  } = req.body; // Assuming userId and booking details are passed in the request body
  try {
    const existingBooking = await Booking.findOne({
      preferreddate,
      preferredtime,
    });

    if (existingBooking) {
      return res
        .status(400)
        .send({ error: "Booking already exists for this date and time" });
    }

    // Create a new instance of the Booking model with user-related data
    const newBooking = new Booking({
      vehicleownername,
      mobilenumber,
      model,
      email,
      message,
      vehiclemake,
      vehiclenumber,
      vehicletype,
      preferreddate,
      preferredtime,
      manufecturedyear,
      userId,
      mechanicId,
    });

    // Save the booking to the database
    await newBooking.save();

    res.status(200).send({
      message: "Booking details stored successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create booking" });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  console.log("working");
  const { userEmail } = req.params;

  try {
    // Find the user by ID
    const user = await User.find({ email: userEmail });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Send user details
    res.status(200).send({
      userId: user._id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch user details" });
  }
};

exports.getBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findOne({ _id: bookingId });
    if (booking) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Booking fetched successfully",
        data: booking,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "No booking found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching booking",
    });
  }
};

exports.bookingById = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findOne({ _id: bookingId });
    if (booking) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Booking fetched successfully",
        data: booking,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "No booking found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching booking",
    });
  }
};

exports.bookingForMechanic = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ mechanicId: userId });
    if (bookings) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "No bookings found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching bookings",
    });
  }
};

exports.acceptBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  try {
    const existingBooking = await Booking.findOne({ _id: bookingId });

    if (!existingBooking) {
      return res.status(400).send({ error: "Booking not exist" });
    }

    existingBooking.isAccepted = "accepted";
    await existingBooking.save();

    const newNotification = new Notification({
      topic: "Appointemnt Accepted",
      message: "Appointemnt accepted",
      recieverId: existingBooking.userId,
      mechanicId: existingBooking.mechanicId,
      bookingId: existingBooking._id,
    });
    await newNotification.save();

    res.status(200).send({
      message: "Booking details updated successfully",
      data: existingBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create booking" });
  }
};

exports.rejectBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  try {
    const existingBooking = await Booking.findOne({ _id: bookingId });

    if (!existingBooking) {
      return res.status(400).send({ error: "Booking not exist" });
    }

    existingBooking.isAccepted = "rejected";
    await existingBooking.save();

    const newNotification = new Notification({
      topic: "Appointemnt Rejected",
      message: "Appointemnt rejected",
      recieverId: existingBooking.userId,
      mechanicId: existingBooking.mechanicId,
      bookingId: existingBooking._id,
    });
    await newNotification.save();

    res.status(200).send({
      message: "Booking details updated successfully",
      data: existingBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create booking" });
  }
};

//complete booking
exports.completeBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  try {
    const existingBooking = await Booking.findOne({ _id: bookingId });
    if (!existingBooking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    existingBooking.isAccepted = "completed";
    await existingBooking.save();

    res.status(200).send({
      message: "Booking completed successfully",
      data: existingBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to complete booking" });
  }
};

exports.addBill = async (req, res) => {
  const { bookingId } = req.params;
  const { workItems, netTotal } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.works = workItems;
    booking.netTotal = netTotal;
    booking.isAccepted = "completed";
    booking.isPaid = false;

    await booking.save();
    for (const item of workItems) {
      const part = await Inventory.findOne({ partCode: item.partCode });
      part.quantity = part.quantity - item.qty;
      await part.save();
    }

    // Create a notification for the user
    const newNotification = new Notification({
      topic: "Bill Added",
      message: `A new bill has been added with a total of ${netTotal}`,
      recieverId: booking.userId,
      mechanicId: booking.mechanicId,
      bookingId: booking._id,
    });
    await newNotification.save();

    res.status(200).json({ message: "Bill added successfully", booking });
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ error: "Failed to add bill" });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const data = await Booking.find();

    res.status(200).send({ message: "got all users", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch user details" });
  }
};

exports.getAllBookingsByUserId = async (req, res) => {
  try {
    const allBookings = await Booking.find({ userId: req.params.userId })
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

exports.changePaymentStatus = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.isPaid = true;
    await booking.save();

      return res.status(200).json({
        status: "SUCCESS",
        message: "Booking fetched successfully",
        data: booking,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching booking",
    });
  }
};