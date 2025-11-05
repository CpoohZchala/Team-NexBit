const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/inventory');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to store file data in memory so we can save the buffer to the DB
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;