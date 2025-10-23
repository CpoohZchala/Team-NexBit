const Mechanic = require("../schemas/mechanicSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const otpGenerator = require("otp-generator");

// Create a new mechanic
exports.createMechanic = async (req, res) => {
  const {
    username,
    password,
    email,
    phone,
    firstname,
    lastname,
    idnumber,
    address,
    securityQuestion,
  } = req.body;

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new instance of the mechanic model
    const newMechanic = new Mechanic({
      username,
      password: hashedPassword, // Save hashed password
      email,
      phone,
      firstname,
      lastname,
      idnumber,
      address,
      securityQuestion,
    });

    // Save the mechanic to the database
    await newMechanic.save();

    res.status(201).send({ message: "Mechanic profile created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create mechanic profile" });
  }
};

// Mechanic login
exports.postMechanic = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if input fields are empty
  if (!identifier || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Empty input fields",
    });
  }

  try {
    // Find the mechanic by username or email
    const data = await Mechanic.findOne({
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
          data: data
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

// Get mechanic by username or email
exports.getMechanic = async (req, res) => {
  const { identifier } = req.params;

  try {
    // Find mechanic by either username or email
    const mechanicData = await Mechanic.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (mechanicData) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Mechanic data fetched successfully",
        data: mechanicData,
      });
    } else {
      res.status(404).json({
        status: "FAILED",
        message: "Mechanic not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching mechanic data",
    });
  }
};

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};


exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.status(200).json({ data: mechanics });
  } catch (error) {
    console.error("Error fetching mechanics:", error);
    res.status(500).json({ error: "Failed to fetch mechanics" });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const mechanicData = await Mechanic.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!mechanicData) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    mechanicData.password = hashedPassword;
    await mechanicData.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while resetting password",
    });
  }
};

//mechanic count
exports.getAllMechanicsCount = async (req, res) => {
  try {
    const data = await Mechanic.find();

    res.status(200).send({ message: "got all mechanics count", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch mechanic count" });
  }
}

//get mechanic by id
exports.getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.mechanicId);
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" });
    }
    res.status(200).json(mechanic);
  } catch (error) {
    console.error("Error fetching mechanic details:", error);
    res.status(500).json({ error: "Failed to fetch mechanic details" });
  }
};
3

exports.getAllMechanicsToAdmin = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.mechanicId);
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" });
    }
    res.status(200).json(mechanic);
  } catch (error) {
    console.error("Error fetching mechanic details:", error);
    res.status(500).json({ error: "Failed to fetch mechanic details" });
  }
};