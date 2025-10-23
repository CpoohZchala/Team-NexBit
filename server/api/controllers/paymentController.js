require('dotenv').config(); // Load environment variables from .env file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Notification = require("../schemas/notificationSchema");
const Booking = require("../schemas/bookingSchema");

exports.createCheckoutSession = async (req, res) => {
  const { netTotal, bookingId } = req.body;

  if (!netTotal || typeof netTotal !== 'number') {
    return res.status(400).json({ error: "Invalid netTotal amount" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Total Invoice Amount',
            },
            unit_amount: netTotal * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: "http://localhost:5173/paymentSuccess/" + bookingId,
      cancel_url: "http://localhost:5173/paymentcancel",
    });


    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
};

exports.createNotification = async (req, res) => {
  const { userId } = req.params;
  const { mechanicId, bookingId, topic, message } = req.body;

  try {
    const newNotification = new Notification({
      topic,
      message,
      recieverId: userId,
      mechanicId: mechanicId,
      bookingId: bookingId,
    });
    await newNotification.save();
    return res.status(201).json({
      status: "SUCCESS",
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while creating notification",
    });
  }
};
