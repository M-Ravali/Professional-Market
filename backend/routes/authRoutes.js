const express = require("express");
const {
  registerUser,
  authUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);


module.exports = router;  