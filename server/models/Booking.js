const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  searchOffersData: Object,
  travelerDetail: Object,
  transectionID: String,
  grandTotal: String,
});

module.exports = mongoose.model("Bookings", BookingSchema);
