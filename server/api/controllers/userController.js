const User = require("../schemas/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Payment = require("../schemas/paymentSchema");
const Feedback = require("../schemas/feedbackSchema");

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password, email, phone, fullname, address, securityQuestion, answer } = req.body;

  try { 
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new instance of the user model
    const newUser = new User({
      username,
      password: hashedPassword, // Save hashed password
      email,
      phone,
      fullname,
      address,
      securityQuestion,
      answer
    });
    
    // Save the user to the database
    await newUser.save();
    
    res.status(201).send({ message: 'Customer profile created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to create customer profile' });
  }
};

// User login
exports.postUser = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if input fields are empty
  if (!identifier || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Empty input fields",
    });
  }

  try {
    // Find the user by username or email
    const data = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (data) {
      const hashedPassword = data.password;

      // Compare the provided password with the stored hashed password
      const result = await bcrypt.compare(password, hashedPassword);

      if (result) {
        // Generate JWT token
        const token = jwt.sign({ id: data._id }, 'your_jwt_secret', { expiresIn: '1h' });

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

// Get user by username or email
exports.getUser = async (req, res) => {
  const { identifier } = req.params;

  try {
    // Find user by either username or email
    const userData = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (userData) {
      res.status(200).json({
        status: "SUCCESS",
        message: "User data fetched successfully",
        data: userData,
      });
    } else {
      res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching user data",
    });
  }
};



// Post payment Details
exports.postPayment = async (req, res) => {
  const {  cardnumber, cardholdername, expireddate, cvv, amount } = req.body;

  try { 
    // Hash cvv before saving
    const hashedCvv = await bcrypt.hash(cvv, 10);

    if (cardnumber!==12){
      return res.json({
        status: "FAILED",
        message: "Invalid card number",
      });
    }
    
    // Create a new instance of the user model
    const newPayment = new Payment({
      cardnumber,
      cardholdername,
      expireddate,
      cvv: hashedCvv, // Save hashed cvv
      amount
    });
     
    // Save the mechanic to the database
    await newPayment.save();
    
    
    res.status(201).send({ message: 'Payment Details saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to save payment details' });
  }
}

// Save feedback
exports.postFeedback = async (req, res) => {
  const {  name, number, message } = req.body;

  try { 
    // Create a new instance of the user model
    const newFeedback = new Feedback({
      name,
      number,
      message
    });
     
    // Save the mechanic to the database
    await newFeedback.save();
    
    
    res.status(201).send({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to save feedback' });
  }
}

//get question to reset password
exports.getQuestion = async (req, res) => {
  const { identifier } = req.params; // Get the user identifier from the request

  try {
      // Find the user by the identifier (assuming it's the user ID)
      const user = await User.findById(identifier).select('security_question'); // Select only the security question field

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Send the question back to the frontend
      res.status(200).json({ question: user.security_question });
  } catch (error) {
      console.error('Error fetching user security question:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

//get security question
exports.getSecurityQuestion = async (req, res) => {
  const { identifier } = req.body; // Get the user identifier from the request

  try {
      // Find the user by the identifier (assuming it's the user ID)
      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select('securityQuestion'); // Select only the security question field

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Send the question back to the frontend
      res.status(200).json({ question: user.securityQuestion });
  } catch (error) {
      console.error('Error fetching user security question:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

//validate answer for security question
exports.validateSecurityAnswer = async (req, res) => {
  const { identifier, answer } = req.body; // Get the user identifier and answer from the request

  try {
      // Find the user by the identifier (assuming it's the user ID)
      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided answer with the stored answer
      if (answer === user.answer) {
          return res.status(200).json({ isAnswerCorrect: true });
      } else {
          return res.status(200).json({ isAnswerCorrect: false });
      }
  } catch (error) {
      console.error('Error validating security answer:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { identifier, password } = req.body; // Get the user identifier and new password from the request

  try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Find the user by the identifier (assuming it's the user ID)
      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send({ message: "got all users", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch user details" });
  }
};

//get all users to admin panel
exports.getAllUsersToAdmin = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}