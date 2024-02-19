const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const BookingSchema = require("../models/Booking");
const PaymentStatus = require("../models/PaymentStatus");
const TicketBookData = require("../models/TicketBookData");

router.use(express.json());
router.use(cookieParser());
const { AmadeusApi } = require("../libraries/flight/amadious/API");
const { Phonepe, checkStatus } = require("../controller/Phonepe");

const amadeusApi = new AmadeusApi();

router.post("/search_results", async (req, res) => {
  await amadeusApi
    .getSearchResult(req.body)
    .then((response) => {
      res.header("Content-Type", "application/json");
      res.send(JSON.stringify(response.data));
    })
    .catch((err) => {
      return res.json({ error: err });
    });
});

router.post("/booking", async (req, res) => {
  try {
    const response = await amadeusApi.getSearchOffers(req.body);

    res.header("Content-Type", "application/json");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const responseData = await req.body;
    const searchOffersData = responseData.offerPriceData.flightOffers;
    const travelerDetail = responseData.travelerDetail;
    const grandTotal = searchOffersData[0].price.grandTotal;

    function getTransectionID() {
      const timeStamp = Date.now();
      const randomNum = Math.floor(Math.random() * 100000);
      const merchantPrefix = "T";
      const transectionID = `${merchantPrefix}${timeStamp}${randomNum}`;
      return transectionID;
    }
    const transectionID = getTransectionID();

    const bookingData = new BookingSchema({
      searchOffersData,
      travelerDetail,
      transectionID,
      grandTotal,
    });
    if (!bookingData) {
      return res.status(404).json({ msg: "Data not found" });
    }
    await bookingData.save();

    await Phonepe(transectionID, grandTotal, req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/processbooking", async (req, res) => {
  const transectionID = req.body.transactionId;
  try {
    const paymentstatus = await checkStatus(transectionID);

    if (paymentstatus.success === true) {
      const existingPaymentStatus = await PaymentStatus.findOne({
        "paymentstatus.data.transactionId": transectionID,
      });

      if (!existingPaymentStatus) {
        // If the document does not exist, create and save a new one
        const paymentStatusData = new PaymentStatus({
          paymentstatus,
        });

        if (paymentStatusData) {
          await paymentStatusData.save();
          console.log("Data Saved");
        } else {
          // return res.status(404).json({ msg: "Data not found" });
          console.log("Data not found");
        }
      } else {
        console.log("PaymentStatus data with transectionID already exists");
      }

      const bookingData = await BookingSchema.findOne({ transectionID });

      if (bookingData) {
        if (
          Number(paymentstatus.data.amount / 100) ===
          Number(bookingData.grandTotal)
        ) {
          const amadeusApiResponse = await amadeusApi.createOrder({
            bookingData,
          });
          if (amadeusApiResponse.status === true) {
            const ticket = amadeusApiResponse.data;
            const ticketBookingData = TicketBookData({
              transectionID,
              paymentstatus,
              ticket,
            });
            await ticketBookingData.save();
            console.log("ticket Saved");
            res.status(200).json("Success");
            await BookingSchema.deleteOne({ transectionID });
          } else {
            res.status(404).json("Booking Failed");
          }
        } else {
          res.status(404).json({ msg: "Amount not matched" });
        }
      } else {
        console.log("BookingData not found");
      }
    } else {
      await BookingSchema.deleteOne({ transectionID });
      res.status(500).json({ msg: "Payment not successful" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Error checking payment status" });
  }
});

router.post("/bookingstatus", async (req, res) => {
  const transectionID = req.body.transactionId;
  const ticketExist = await TicketBookData.findOne({
    transectionID: transectionID,
  });
  const id = ticketExist.ticket.id;
  try {
    const response = await amadeusApi.orderManagement(id);
    res.header("Content-Type", "application/json");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
