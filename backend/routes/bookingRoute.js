const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth");
const { createBooking, getClientBookings } = require("../controllers/bookingController");

// Route to fetch all users
router.post("/bookings", protect, createBooking);
router.get("/client/bookings", protect, getClientBookings);

module.exports = router;
