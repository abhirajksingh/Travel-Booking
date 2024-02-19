const mongoose = require("mongoose");

const PaymentStatus = new mongoose.Schema({
  paymentstatus: Object,
});

module.exports = mongoose.model("paymentstatus", PaymentStatus);
