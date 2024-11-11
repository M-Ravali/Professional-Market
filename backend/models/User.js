const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      required: true,
      enum: ["client", "professional"],
    },
    profession: String,
    skills: [String],
    experience: Number,
    location: String,
    certifications: [String],
    availability: [String],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match entered password with stored password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Search Professionals with flexible filters
UserSchema.statics.findProfessionals = async function (filters) {
  const query = {
    userType: "professional", // We are only interested in professionals
  };

  // Handle location filter (partial match)
  if (filters.location) {
    query.location = { $regex: filters.location, $options: "i" }; // Case-insensitive partial match
  }

  // Optionally, handle profession filter
  if (filters.profession) {
    query.profession = { $regex: filters.profession, $options: "i" }; // Case-insensitive match
  }

  return await this.find(query).exec();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
