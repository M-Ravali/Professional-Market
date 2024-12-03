const Booking = require("../models/Booking");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    // Check if the user is a client
    if (req.user.userType !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can book professionals." });
    }

    // Extract information from the request body
    const { professionalId, date, time, message } = req.body;

    // Find the professional using the professionalId
    const professional = await User.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: "Professional not found." });
    }

    // Check if the client has already booked this professional at the same date and time
    const existingBooking = await Booking.findOne({
      clientId: req.user._id,
      professionalId,
      date,
      time,
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You have already booked this professional for this date and time.",
      });
    }

    // Create a new booking
    const booking = new Booking({
      clientId: req.user._id,
      professionalId,
      date,
      time,
      message,
    });

    // Save the new booking to the database
    await booking.save();

    // Respond with the new booking data
    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Fetch bookings for the client and calculate status
// Fetch bookings for the client and calculate status
exports.getClientBookings = async (req, res) => {
  try {
    if (req.user.userType !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can view their bookings." });
    }

    // Fetch bookings from the database
    const bookings = await Booking.find({ clientId: req.user._id })
      .populate("professionalId", "name profession location")
      .sort({ date: -1 }); // Sort by most recent

    // Get current date and time (UTC for consistency)
    const currentDateTime = new Date();
    const localCurrentDateTime = new Date(
      currentDateTime.toLocaleString("en-US", { timeZone: "America/Chicago" })
    ); // Use your time zone
    console.log(
      `Local Current DateTime: ${localCurrentDateTime.toISOString()}`
    );

    // Add status to each booking
    const bookingsWithStatus = bookings.map((booking) => {
      // Combine date and time into a single Date object for comparison
      const bookingDateTime = new Date(
        `${booking.date.toISOString().split("T")[0]}T${booking.time}:00Z`
      );
      const status =
        bookingDateTime < currentDateTime ? "Completed" : "Pending";

      return {
        ...booking._doc, // Spread existing booking fields
        status,
      };
    });

    // Return the bookings with their status
    res.status(200).json(bookingsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
