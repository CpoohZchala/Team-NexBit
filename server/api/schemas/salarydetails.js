const mongoose = require('mongoose');

const salarydetailsSchema = new mongoose.Schema({
    mechanicname: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    bonus: {
        type: String,
        required: true,
    },
    total: {
        type: String,
        required: true,
    },
    datepaid: {
        type: String,
        required: true,
    },
});

const Salarydetails = mongoose.model('Salarydetails', salarydetailsSchema);

module.exports = Salarydetails;