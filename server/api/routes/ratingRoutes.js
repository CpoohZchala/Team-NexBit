// backend/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const Rating = require('../schemas/ratingSchema'); 
router.post('/ratings', async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;
    const newRating = new Rating({
      bookingId,
      rating,
      feedback,
      createdAt: new Date()
    });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ratings/average', async (req, res) => {
  try {
    const result = await Rating.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    res.json({ averageRating: result[0]?.averageRating || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Fix: Export the router