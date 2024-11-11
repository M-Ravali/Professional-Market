const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    if (req.user.userType !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can book professionals." });
    }

    console.log(req.user);

    const { professionalId, date, time, message } = req.body;
    const booking = new Booking({
      clientId: req.user._id,
      professionalId,
      date,
      time,
      message,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
