const mongoose = require('mongoose');

const paymentdetailsSchema = new mongoose.Schema({
    cardnumber: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    expirydate: {
        type: String,
        required: true,
    },
    cardholdername: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
});

const Paymentdetails = mongoose.model('Paymentdetail', paymentdetailsSchema);

module.exports = Paymentdetails;