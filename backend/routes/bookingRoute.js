const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth");
const { createBooking } = require("../controllers/bookingController");

// Route to fetch all users
router.post("/bookings", protect, createBooking);


module.exports = router;
