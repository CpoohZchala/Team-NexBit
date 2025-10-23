require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const inventoryRoutes = require("./api/routes/inventoryRoutes");
const adminRoutes = require("./api/routes/adminRoutes");
const loginRoutes = require("./api/routes/loginRoutes");
const notificationRoutes = require("./api/routes/notificationRoutes");
const chatbotRoutes = require("./api/routes/chatbotRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const Cookies = require('js-cookie');

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/// atlas
mongoose
.connect("mongodb+srv://sfrafri:vrQAf177sh0CxBLC@cluster0.rnqxi.mongodb.net/autocare?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Failed to connect to MongoDB", error));

// Use routes
app.use("/api", adminRoutes);
app.use("/api", loginRoutes);
app.use("/api", require("./api/routes/bookingRoutes"));
app.use("/api", require("./api/routes/userRoutes"));
app.use("/api", notificationRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", paymentRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", require("./api/routes/mechanicRoutes"));
app.use("/api", require("./api/routes/ratingRoutes")); // Make sure path matches your project structure

app.get('/set-cookie', (req, res) => {
  res.cookie('myCookie', 'cookieValue', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax', // or 'Strict' or 'None'
  });
  res.send('Cookie has been set');
});

Cookies.set('myCookie', 'cookieValue', {
  expires: 7, // 7 days
  secure: true,
  sameSite: 'Lax', // or 'Strict' or 'None'
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
