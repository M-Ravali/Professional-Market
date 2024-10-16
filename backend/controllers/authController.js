const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const config = require("../config/config");
const { sendEmail } = require("../middlewares/emailService");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already registered.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Server error", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).send("Invalid email or password.");
    }
    console.log("Login attempt - Stored hash:", user.password);
    console.log("Login attempt - Provided password:", password);

    console.log("User found, comparing passwords");
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", validPassword);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(400).send("Invalid email or password.");
    }

    console.log("Password valid, generating token");
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.send({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
};
exports.resetemailrequest = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password requested for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).send("User not found");
    }

    console.log("User found:", user._id);

    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Generated reset token:", resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();
    console.log("User document updated with reset token");

    // Verify the update
    const updatedUser = await User.findById(user._id);
    console.log("Updated user document:", updatedUser);

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    // Email sending code...
    const emailText = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    const emailHtml = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendEmail(user.email, "Password Reset", emailText, emailHtml);

    console.log("Reset email sent to:", user.email);
    res.send("Password reset email sent");
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send("Server error");
  }
};

// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         console.log('Forgot password requested for email:', email);

//         const user = await User.findOne({ email });
//         if (!user) {
//             console.log('User not found for email:', email);
//             return res.status(404).send('User not found');
//         }

//         console.log('User found:', user._id);

//         const resetToken = crypto.randomBytes(20).toString('hex');
//         console.log('Generated reset token:', resetToken);

//         user.resetPasswordToken = resetToken;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         try {
//             await user.save();
//             console.log('User document updated with reset token');
//         } catch (saveError) {
//             console.error('Error saving user document:', saveError);
//             return res.status(500).send('Error updating user');
//         }

//         // Verify the update
//         const updatedUser = await User.findById(user._id);
//         console.log('Updated user document:', updatedUser);

//         const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

//         // Email sending code...
//         const emailText = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//             Please click on the following link, or paste this into your browser to complete the process:\n\n
//             ${resetUrl}\n\n
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`;

//         const emailHtml = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
//             <p>Please click on the following link, or paste this into your browser to complete the process:</p>
//             <a href="${resetUrl}">${resetUrl}</a>
//             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

//         await sendEmail(
//             user.email,
//             'Password Reset',
//             emailText,
//             emailHtml
//         );

//         console.log('Reset email sent to:', user.email);
//         res.send('Password reset email sent');
//     } catch (error) {
//         console.error('Error in forgotPassword:', error);
//         res.status(500).send('Server error');
//     }
// };
// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         const resetToken = crypto.randomBytes(20).toString('hex');

//         user.resetPasswordToken = resetToken;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         await user.save();

//         console.log('Generated token for user:', user.email, 'Token:', resetToken);

//         const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
//         const emailText = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//             Please click on the following link, or paste this into your browser to complete the process:\n\n
//             ${resetUrl}\n\n
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`;

//         const emailHtml = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
//             <p>Please click on the following link, or paste this into your browser to complete the process:</p>
//             <a href="${resetUrl}">${resetUrl}</a>
//             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

//         await sendEmail(
//             user.email,
//             'Password Reset',
//             emailText,
//             emailHtml
//         );

//         console.log('Reset email sent to:', user.email, 'with token:', resetToken);

//         res.send('Password reset email sent');
//     } catch (error) {
//         console.error('Error in forgotPassword:', error);
//         res.status(500).send('Server error');
//     }
// };

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Attempting to reset password with token:", token);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with the provided token");
      return res
        .status(400)
        .send("Password reset token is invalid or has expired");
    }

    console.log("User found:", user.email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log("Password reset successful for user:", user.email);
    console.log("New password hash:", hashedPassword);

    res.send("Password has been reset successfully");
    const verificationResult = await verifyPasswordAfterReset(
      user._id,
      password
    );
    console.log(
      "Immediate password verification after reset:",
      verificationResult
    );
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).send("Server error");
  }
};

async function verifyPasswordAfterReset(userId, plainPassword) {
  const user = await User.findById(userId);
  if (!user) {
    console.log("User not found for verification");
    return false;
  }

  console.log("Verification - Stored hash:", user.password);
  console.log("Verification - Plain password:", plainPassword);

  const isValid = await bcrypt.compare(plainPassword, user.password);
  console.log("Immediate verification result:", isValid);
  return isValid;
}
