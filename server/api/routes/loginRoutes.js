const express = require("express");
const router = express.Router();
const mechanicController = require("../controllers/mechanicController");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");

// Route for mechanic login
router.post("/mechanic/login", mechanicController.postMechanic);

// Route for user login
router.post("/user/login", userController.postUser);

//Route to get admin by username or email
router.get("/getUserDetail/admin/:identifier", adminController.getAdmin);

// Route to get mechanic by username or email
router.get("/getUserDetail/mechanic/:identifier", mechanicController.getMechanic);

// Route to get user by username or email
router.get("/getUserDetail/user/:identifier", userController.getUser);

// router.post("/forgot-password", userController.forgotPassword);
router.post("/user/get-security-question", userController.getSecurityQuestion);

//get answer for the security question and validate
router.post("/user/validate-security-answer", userController.validateSecurityAnswer);

// Route for resetting password
router.post("/user/reset-password", userController.resetPassword);
router.post("/mechanic/reset-password", mechanicController.resetPassword);

module.exports = router;
