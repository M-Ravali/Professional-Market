const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    profession,
    skills,
    experience,
    location,
    certifications,
    availability,
  } = req.body;

  // Check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("Email already in use");
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    userType,
    profession,
    skills,
    experience,
    location,
    certifications,
    availability,
  });

  try {
    await user.save();
    res.status(201).send("User registered successfully!");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        userType: user.userType,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;

    await user.save();

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Received reset password request with token:", token);
  console.log("Received reset password request with new password:", password);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token is invalid or expired");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({ message: error.message });
  }
};
