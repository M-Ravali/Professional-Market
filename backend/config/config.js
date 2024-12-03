const mongoose = require("mongoose");

const connectDB = async () => {
  // Use environment variable or default to 'mongodb://mongo:27017/professionalmarketdb'
  const dbURI =
    process.env.MONGO_URI || "mongodb://mongo:27017/professionalmarketdb";

  mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
};

module.exports = connectDB;
