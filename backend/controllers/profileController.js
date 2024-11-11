//profileController.js

const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is passed in the URL
    const user = await User.findById(userId)
      .populate("ratings.user", "name email") // Populate ratings with user details (name, email)
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send all user data including the profile details
    res.status(200).json({
      name: user.name,
      email: user.email,
      userType: user.userType,
      profession: user.profession,
      skills: user.skills,
      experience: user.experience,
      location: user.location,
      certifications: user.certifications,
      availability: user.availability,
      ratings: user.ratings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const {
    name,
    location,
    profession,
    skills,
    experience,
    education,
    profileImage,
  } = req.body;

  try {
    // Example logging around line 59
    console.log("User data:", req.user); // Check if req.user exists
    console.log("Request body:", req.body); // Check if the request body has expected fields

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user data
    user.name = name || user.name;
    user.location = location || user.location;
    user.profession = profession || user.profession;
    user.skills = skills || user.skills;
    user.experience = experience || user.experience;
    user.education = education || user.education;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error); // Logs the actual error
    res.status(500).json({ message: "Server error" });
  }
};
