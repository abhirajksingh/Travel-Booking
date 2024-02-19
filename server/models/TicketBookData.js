const mongoose = require("mongoose");

const TicketBookData = new mongoose.Schema({
  transectionID: String,
  paymentstatus: Object,
  ticket: Object,
});

module.exports = mongoose.model("TicketBookData", TicketBookData);
