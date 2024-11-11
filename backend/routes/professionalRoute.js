const express = require("express");
const router = express.Router();
const User = require("../models/User");

// API endpoint to fetch professionals
router.get("/professionals", async (req, res) => {
  try {
    const filters = req.query; // Extract filters from query string

    // Fetch professionals based on the filters
    const professionals = await User.findProfessionals(filters);

    // Return the result
    if (professionals.length === 0) {
      return res.status(404).json({ message: "No professionals found" });
    }

    res.json(professionals);
  } catch (err) {
    console.error("Error fetching professionals:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Search Professionals Route
// router.post("/professionals/search", async (req, res) => {
//   const { location, skills, experience } = req.body;

//   try {
//     const professionals = await User.findProfessionals({
//       location,
//       skills,
//       experience,
//     });
//     res.status(200).json(professionals);
//   } catch (error) {
//     res.status(500).send("Error searching for professionals");
//   }
// });

// Submit a Review Route
router.post("/professionals/review", async (req, res) => {
  const { professionalId, userId, rating, comment } = req.body;

  try {
    const professional = await User.findById(professionalId);
    professional.ratings.push({ user: userId, rating, comment });
    await professional.save();
    res.status(200).send("Review submitted successfully");
  } catch (error) {
    res.status(500).send("Error submitting review");
  }
});

// Update Professional Profile Route
router.put("/professionals/update", async (req, res) => {
  const { professionalId, certifications, availability } = req.body;

  try {
    const professional = await User.findById(professionalId);
    professional.certifications = certifications;
    professional.availability = availability;
    await professional.save();
    res.status(200).send("Profile updated successfully");
  } catch (error) {
    res.status(500).send("Error updating profile");
  }
});

module.exports = router;
