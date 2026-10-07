const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);

router.get("/", bookingController.getAllBookings);

router.get("/user/:userId", bookingController.getUserBookings);

router.patch("/approve/:id", bookingController.approveBooking);

router.patch("/deny/:id", bookingController.denyBooking);

module.exports = router;
